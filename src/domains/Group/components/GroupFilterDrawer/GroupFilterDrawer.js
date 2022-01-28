import { useTranslations } from '@qonsoll/translation'
import { ClearOutlined } from '@ant-design/icons'
import { Box, Button, Col, Row, Select, Text } from '@qonsoll/react-design'
import { Form, Drawer, Select as AntSelect } from 'antd'
import {
  useCollectionData,
  useDocumentData
} from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import {
  GROUPS_MODEL_NAME,
  STUDIES_MODEL_NAME,
  THERAPIST_PROFILES_MODEL_NAME
} from 'bioflow/constants/collections'
import { DISORDERS_MODEL_NAME, CLINICS_MODEL_NAME } from 'app/constants/models'
import { useUserContext } from 'app/domains/User/contexts'
import { useBioflowAccess } from 'bioflow/hooks'
import { useMemo } from 'react'
import _ from 'lodash'

const GroupFilterDrawer = (props) => {
  const {
    initialValues,
    isFilterDrawerVisible,
    setIsFilterDrawerVisible,
    setFilterData,
    onSubmitFilter
  } = props

  //[ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const {
    _id: therapistId,
    clinics: therapistClinics,
    bioflowTherapistProfileId
  } = useUserContext()
  const { isAdmin } = useBioflowAccess()
  const firestore = firebase.firestore()

  const [therapistProfile] = useDocumentData(
    bioflowTherapistProfileId &&
      firestore
        .collection(THERAPIST_PROFILES_MODEL_NAME)
        .doc(bioflowTherapistProfileId)
  )
  const [studies] = useCollectionData(
    isAdmin
      ? firestore.collection(STUDIES_MODEL_NAME)
      : therapistProfile?.studies &&
          firestore
            .collection(STUDIES_MODEL_NAME)
            .where('_id', 'in', therapistProfile?.studies)
  )
  const [disorders] = useCollectionData(
    isAdmin
      ? firestore.collection(DISORDERS_MODEL_NAME)
      : firestore
          .collection(DISORDERS_MODEL_NAME)
          .where('clinicId', 'in', Object.keys(therapistClinics))
  )
  const [groups] = useCollectionData(
    isAdmin
      ? firestore.collection(GROUPS_MODEL_NAME)
      : firestore
          .collection(GROUPS_MODEL_NAME)
          .where(`therapists.${therapistId}`, '!=', '')
  )
  const [clinics] = useCollectionData(
    isAdmin
      ? firestore.collection(CLINICS_MODEL_NAME)
      : firestore
          .collection(CLINICS_MODEL_NAME)
          .where('_id', 'in', Object.keys(therapistClinics))
  )

  //[COMPUTED PROPERTIES]
  const groupsWeekNumbers = useMemo(() => {
    //get week numbers of all groups
    let weekNumbers = groups?.map((group) => group?.weekNumber)
    //create array of unique values for filter select
    weekNumbers = [...new Set(weekNumbers)]
    return weekNumbers
  }, [groups])

  const numberOfPatients = _.range(1, 7)

  const formatedDisorders = useMemo(() => {
    let clinicDisorders = {}
    //iterate by therapist therapistClinics and then iterate by all disorders
    //to get disorder of current clinic
    //and create object in format [clinicId]: [array of this clinic disorders]
    clinics?.forEach(({ _id, name }) => {
      clinicDisorders[name] = disorders?.filter(
        ({ clinicId }) => clinicId === _id
      )
    })
    return clinicDisorders
  }, [disorders, clinics])

  //[CLEAN FUNCTIONS]
  const onDrawerClose = () => {
    setIsFilterDrawerVisible(false)
  }

  const onAcceptFilter = (values) => {
    const { numberOfPatients, weekNumber } = values
    const isFilterEmpty = !Object.values(values).filter(
      (fieldValue) => fieldValue
    )?.length

    //if form was submited without values reset data in storage
    if (isFilterEmpty) localStorage.setItem('filterData', JSON.stringify([]))
    //convert numbers as string to number
    if (!!numberOfPatients) values.numberOfPatients = Number(numberOfPatients)
    if (!!weekNumber) values.weekNumber = Number(weekNumber)

    //convert object to array of objects
    let fieldsWithValue = Object.keys(values).map((key) => ({
      [key]: values[key]
    }))
    //filter fields with undefiend value
    fieldsWithValue = fieldsWithValue?.filter(
      (item) => Object.values(item)?.[0]
    )
    onSubmitFilter?.(fieldsWithValue)
    setIsFilterDrawerVisible(false)
  }

  const onResetFilter = () => {
    //reset state filter data, storage and form fields
    setFilterData([])
    localStorage.setItem('filterData', JSON.stringify([]))
    form.resetFields()
  }

  const drawerTitle = (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Text> {t('Groups filter')}</Text>

      <Button icon={<ClearOutlined />} type="text" onClick={onResetFilter} />
    </Box>
  )

  return (
    <Drawer
      closable={false}
      title={drawerTitle}
      visible={isFilterDrawerVisible}
      onClose={onDrawerClose}>
      <Form form={form} initialValues={initialValues} onFinish={onAcceptFilter}>
        <Row noGutters>
          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Week number')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="weekNumber">
              <Select placeholder={t('Select week number')} allowClear>
                {groupsWeekNumbers?.map((weekNumber, index) => (
                  <AntSelect.Option key={index} value={weekNumber}>
                    {`${t('Week')} ${weekNumber}`}
                  </AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Number of patients')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="numberOfPatients">
              <Select placeholder={t('Select number of patients')} allowClear>
                {numberOfPatients.map((number) => (
                  <AntSelect.Option key={number}>{number}</AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Disorder')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="disorderId">
              <Select placeholder={t('Select disorder')} allowClear>
                {Object.keys(formatedDisorders)?.map((clinicName, index) => (
                  <AntSelect.OptGroup
                    key={index}
                    label={`${clinicName} (${t('clinic')})`}>
                    {formatedDisorders?.[clinicName]?.map((disorder) => (
                      <AntSelect.Option
                        key={disorder?._id}
                        value={disorder?._id}>
                        {disorder?.name}
                      </AntSelect.Option>
                    ))}
                  </AntSelect.OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Study')}</Text>
          </Col>
          <Col cw={12} mb={4}>
            <Form.Item name="studyId">
              <Select placeholder={t('Select study')} allowClear>
                {studies?.map((study) => (
                  <AntSelect.Option key={study?._id} value={study?._id}>
                    {study?.name}
                  </AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row h="right" noGutters>
          <Col cw="auto" mr={3}>
            <Button size="middle" type="text" onClick={onDrawerClose}>
              {t('Cancel')}
            </Button>
          </Col>

          <Col cw="auto">
            <Button size="middle" type="primary" onClick={form.submit}>
              {t('Apply')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default GroupFilterDrawer
