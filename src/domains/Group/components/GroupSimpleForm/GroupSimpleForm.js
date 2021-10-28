import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import moment from 'moment'
import firebase from 'firebase'
import { Form, Tooltip } from 'antd'
import {
  Button,
  Col,
  Input,
  Remove,
  Row,
  Text,
  Icon,
  Box
} from '@qonsoll/react-design'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useSaveData } from 'app/hooks'
import { useClinicContext } from 'app/domains/Clinic/contexts'
import { TherapistAddForm } from 'bioflow/domains/Therapist/components'
import { PatientAddForm } from 'bioflow/domains/Patient/components'
import { DisorderSelect } from 'app/domains/Disorder/components'
import { ClinicSelect } from 'bioflow/domains/Clinic/components'
import { StudySelect } from 'bioflow/domains/Study/components'
import { DRAFT_STATUS } from 'bioflow/constants/groupStatuses'
import { CLINICS_MODEL_NAME, USERS_MODEL_NAME } from 'app/constants/models'
import {
  GROUPS_MODEL_NAME,
  THERAPISTS_PROFILE_MODEL_NAME
} from 'bioflow/constants/collections'

const exclamationIconStyles = {
  cursor: 'help',
  color: 'var(--ql-color-accent1)',
  display: 'flex',
  size: 'medium'
}

const MOMENT_FORMAT_FOR_TIMEPICKER = 'YYYY-MM-DD'
const NEXT_COLLECT_DIFF = 3
const CORRECT_FIRST_DAYS = ['Mon', 'Tue', 'Fri']
const WRONG_FOURTH_DAYS = ['Sun', 'Sat', 'Wed', 'Tue']
const DEFAULT_VALUE_FOR_DATEPICKERS = {
  startDay: moment().format(MOMENT_FORMAT_FOR_TIMEPICKER),
  fourthDay: moment().add(3, 'days').format(MOMENT_FORMAT_FOR_TIMEPICKER)
}

function GroupSimpleForm(props) {
  const {
    loading,
    submitText,
    id,
    clinicQuery = firebase
      .firestore()
      .collection(CLINICS_MODEL_NAME)
      .where('bioflowAccess', '==', true),
    studyQuery,
    initialValues = { ...DEFAULT_VALUE_FOR_DATEPICKERS }
  } = props

  // [ADDITIONAL_HOOKS]
  const [groupForm] = Form.useForm()
  const history = useHistory()
  const { t } = useTranslations()
  const { _id: clinicId, bioflowAccess } = useClinicContext()
  const { save, update } = useSaveData()

  // [COMPONENT_STATE_HOOKS]
  const [selectedClinic, setSelectedClinic] = useState(
    initialValues?.clinicId || (bioflowAccess && clinicId)
  )
  const [selectedStudy, setSelectedStudy] = useState(initialValues?.studyId)
  const [groupId, setGroupId] = useState(id)

  // [COMPUTED_PROPERTIES]
  const form = useMemo(() => props.form || groupForm, [groupForm, props.form])

  // [CLEAN_FUNCTIONS]
  const onDateChange = async (e, field, amount) => {
    const value = e.target.value
    if (value) {
      form.setFieldsValue({
        [field]: moment(value)
          .add(amount, 'days')
          .format(MOMENT_FORMAT_FOR_TIMEPICKER)
      })
      try {
        const value = await form.validateFields([field])
        if (groupId && value) {
          await update({
            collection: GROUPS_MODEL_NAME,
            id: groupId,
            data: {
              [Object.keys(value)[0]]: firebase.firestore.Timestamp.fromDate(
                new Date(value[Object.keys(value)[0]])
              )
            }
          })
        }
      } catch (notValidFormData) {
        console.log(notValidFormData)
      }
    }
  }

  const resetStudy = async (value) => {
    setSelectedStudy(value)
    let therapists = form.getFieldValue('therapists') || {}
    const selectedTherapists = Object.keys(therapists)
    const therapistsIds = []
    console.log('before', { ...therapists })

    if (selectedTherapists.length) {
      for (const therapistId of selectedTherapists) {
        const therapistSnapshot = await firebase
          .firestore()
          .collection(USERS_MODEL_NAME)
          .doc(therapistId)
          .get()

        const therapistData = therapistSnapshot.data()

        const therapistProfileSnapshot = await firebase
          .firestore()
          .collection(THERAPISTS_PROFILE_MODEL_NAME)
          .doc(therapistData.bioflowTherapistProfileId)
          .get()

        const therapistProfileData = therapistProfileSnapshot.data()

        // Select therapists with selected study
        if (therapistProfileData.studies.includes(value)) {
          therapistsIds.push(therapistData._id)
        }
      }

      // remove therapists witch don't have selected study
      therapistsIds.length &&
        selectedTherapists.forEach((therapistId) => {
          if (!therapistsIds.includes(therapistId)) {
            delete therapists[therapistId]
          }
        })
    }

    const resetedFields = { therapists }
    form.setFieldsValue(resetedFields)
    if (groupId) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: groupId,
        data: resetedFields
      })
    }
  }

  const resetClinic = async (value) => {
    setSelectedClinic(value)

    let therapists = form.getFieldValue('therapists') || {}
    const selectedTherapists = Object.keys(therapists)
    const therapistsData = []

    if (selectedTherapists.length) {
      for (const therapistId of selectedTherapists) {
        const snapshot = await firebase
          .firestore()
          .collection(USERS_MODEL_NAME)
          .doc(therapistId)
          .get()

        const data = snapshot.data()
        if (data?.clinics && Object.keys(data?.clinics).includes(value)) {
          therapistsData.push(data._id)
        }
      }

      selectedTherapists.forEach((therapistId) => {
        if (!therapistsData.includes(therapistId)) {
          delete therapists[therapistId]
        }
      })
    }

    const resetedFields = { therapists, disorderId: null }
    form.setFieldsValue(resetedFields)
    if (groupId) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: groupId,
        data: resetedFields
      })
    }
  }

  const saveData = async (value, data) => {
    if (!groupId) {
      const therapists = form.getFieldValue('therapists') || {}

      const clinicId = selectedClinic
        ? selectedClinic
        : form.getFieldValue('clinicId')
      const prepareData = {
        ...value,
        therapists,
        weekNumber: moment(data.startDay).week(),
        status: DRAFT_STATUS
      }
      if (clinicId) {
        prepareData.clinicId = clinicId
      }

      const docId = await save({
        collection: GROUPS_MODEL_NAME,
        data: prepareData
      })
      return setGroupId(docId)
    }
    await update({
      collection: GROUPS_MODEL_NAME,
      id: groupId,
      data: value
    })
  }

  const draftSave = async (value, data) => {
    const changedFieldName = Object.keys(value)[0]
    if (['fourthDay', 'startDay'].includes(changedFieldName)) {
      value[changedFieldName] = firebase.firestore.Timestamp.fromDate(
        new Date(value[changedFieldName])
      )
    }

    if (changedFieldName === 'patients') {
      return
    }

    try {
      await form.validateFields(Object.keys(value))
      await saveData(value, data)
    } catch (formData) {
      const { errorFields } = formData
      console.log(formData)
      if (!errorFields?.length) {
        await saveData(value, data)
      }
    }
  }

  const checkInitialDate = () => {
    const fourthDay = moment().add(NEXT_COLLECT_DIFF, 'days')
    while (WRONG_FOURTH_DAYS.includes(fourthDay.format('ddd'))) {
      fourthDay.add(1, 'days')
    }

    form.setFieldsValue({
      startDay:
        initialValues?.startDay ||
        fourthDay
          .subtract(NEXT_COLLECT_DIFF, 'days')
          .format(MOMENT_FORMAT_FOR_TIMEPICKER),
      fourthDay:
        initialValues?.fourthDay ||
        fourthDay
          .add(NEXT_COLLECT_DIFF, 'days')
          .format(MOMENT_FORMAT_FOR_TIMEPICKER)
    })
  }

  useEffect(() => {
    if (!initialValues?.startDay) {
      checkInitialDate()
    }
  }, [])

  return (
    <Form {...props} form={form} onValuesChange={draftSave}>
      <Row noGutters>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Clinic')}</Text>
          <Form.Item
            name="clinicId"
            initialValue={bioflowAccess && clinicId}
            rules={[{ required: true, message: t('Select clinic, please') }]}>
            <ClinicSelect
              query={clinicQuery}
              placeholder={t('Select clinic')}
              onChange={resetClinic}
            />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Study')}</Text>
          <Form.Item
            name="studyId"
            rules={[{ required: true, message: t('Select study, please') }]}>
            <StudySelect
              placeholder={t('Select study')}
              query={studyQuery}
              onChange={resetStudy}
            />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Disorder')}</Text>
          <Form.Item
            name="disorderId"
            rules={[{ required: true, message: t('Select disorder, please') }]}>
            <DisorderSelect
              placeholder={t('Select disorder')}
              clinicId={selectedClinic}
              disabled={!selectedClinic}
            />
          </Form.Item>
        </Col>

        <Col cw={12}>
          <Row negativeBlockMargin>
            <Col cw={[12, 12, 6]} mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <Text mr={2}>{t('Start day')}</Text>
                <Tooltip title={t('Available days: Mon, Tue, Fri')}>
                  <Icon
                    {...exclamationIconStyles}
                    component={<ExclamationCircleOutlined />}
                  />
                </Tooltip>
              </Box>
              <Form.Item
                name="startDay"
                rules={[
                  {
                    require: true,
                    message: t('Enter start day, please')
                  },
                  {
                    validator: (_, value) =>
                      CORRECT_FIRST_DAYS.includes(moment(value).format('ddd'))
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('Select correct day')))
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Start day')}
                  onChange={(e) => onDateChange(e, 'fourthDay', 3)}
                  min={DEFAULT_VALUE_FOR_DATEPICKERS.startDay}
                />
              </Form.Item>
            </Col>

            <Col cw={[12, 12, 6]} mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <Text mr={2}>{t('Fourth day')}</Text>
                <Tooltip title={t('Available days: Mon, Thu, Fri')}>
                  <Icon
                    {...exclamationIconStyles}
                    component={<ExclamationCircleOutlined />}
                  />
                </Tooltip>
              </Box>
              <Form.Item
                name="fourthDay"
                rules={[
                  {
                    require: true,
                    message: t('Enter fourth day, please')
                  },
                  {
                    validator: (_, value) =>
                      WRONG_FOURTH_DAYS.includes(moment(value).format('ddd'))
                        ? Promise.reject(new Error(t('Select correct day')))
                        : Promise.resolve()
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Fourth day')}
                  onChange={(e) =>
                    onDateChange(e, 'startDay', -NEXT_COLLECT_DIFF)
                  }
                  min={DEFAULT_VALUE_FOR_DATEPICKERS.fourthDay}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item name="therapists">
            <TherapistAddForm
              clinicId={selectedClinic}
              studyId={selectedStudy}
              disabled={!selectedClinic || !selectedStudy}
            />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item name="patients">
            <PatientAddForm form={form} saveData={saveData} />
          </Form.Item>
        </Col>
      </Row>

      <Row my={4} h="right" noGutters>
        <Col cw="auto" mr={3}>
          <Button
            size="middle"
            type="text"
            onClick={history.goBack}
            disabled={loading}>
            {t('Cancel')}
          </Button>
        </Col>
        {initialValues?.status === DRAFT_STATUS && (
          <Col cw="auto" mr={3}>
            <Remove
              icon
              size="middle"
              type="text"
              onSubmit={async () => {
                await firebase
                  .firestore()
                  .collection(GROUPS_MODEL_NAME)
                  .doc(initialValues._id)
                  .delete()
                history.goBack()
              }}
              disabled={loading}>
              {t('Remove')}
            </Remove>
          </Col>
        )}
        <Col cw="auto">
          <Button
            size="middle"
            type="primary"
            onClick={form.submit}
            loading={loading}>
            {submitText || t('Activate')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

GroupSimpleForm.propTypes = {
  clinicQuery: PropTypes.object,
  loading: PropTypes.bool,
  id: PropTypes.string, // need on edit routes
  submitText: PropTypes.string
}

export default GroupSimpleForm
