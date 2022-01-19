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
import {
  useBioflowAccess,
  useGroupFullData,
  useActivities
} from 'bioflow/hooks'
import { useUserContext } from 'app/domains/User/contexts'
import _ from 'lodash'
import { CREATE_GROUP, EDIT_GROUP } from 'bioflow/constants/activitiesTypes'

const exclamationIconStyles = {
  cursor: 'help',
  color: 'var(--ql-color-accent1)',
  display: 'flex',
  size: 'medium'
}

const MOMENT_FORMAT_FOR_TIMEPICKER = 'YYYY-MM-DD'
const NEXT_COLLECT_DIFF = 3
const CORRECT_FIRST_DAYS = ['Mon', 'Tue']
const WRONG_FOURTH_DAYS = ['Sun', 'Sat', 'Wed', 'Tue', 'Mon']
const DEFAULT_VALUE_FOR_DATEPICKERS = {
  firstDay: moment().format(MOMENT_FORMAT_FOR_TIMEPICKER),
  fourthDay: moment()
    .add(NEXT_COLLECT_DIFF, 'days')
    .format(MOMENT_FORMAT_FOR_TIMEPICKER)
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
    initialValues = { ...DEFAULT_VALUE_FOR_DATEPICKERS },
    onFinish
  } = props

  // [ADDITIONAL_HOOKS]
  const [groupForm] = Form.useForm()
  const history = useHistory()
  const { t } = useTranslations()
  const { isAdmin } = useBioflowAccess()
  const { createActivity } = useActivities()
  const { _id: clinicId, bioflowAccess } = useClinicContext()
  const user = useUserContext()
  const { save, update } = useSaveData()

  // [COMPONENT_STATE_HOOKS]
  const [selectedClinic, setSelectedClinic] = useState(
    initialValues?.clinicId || (bioflowAccess && clinicId)
  ) // Need to show & filter correct therapists.
  const [selectedStudy, setSelectedStudy] = useState(initialValues?.studyId) // Need to show & filter correct therapists.
  const [groupId, setGroupId] = useState(id) // Used in draft save.

  const groupFullData = useGroupFullData(groupId || id)

  // [COMPUTED_PROPERTIES]
  const form = useMemo(() => props.form || groupForm, [groupForm, props.form])

  //check who created group and prepare data for activity
  const triggeredByActivityData = useMemo(
    () =>
      isAdmin
        ? {
            adminDisplayName: `${user?.firstName} ${user?.lastName}`,
            adminEmail: user?.email
          }
        : {
            therapistDisplayName: `${user?.firstName} ${user?.lastName}`,
            therapistEmail: user?.email,
            therapistRole:
              _.capitalize?.(groupFullData?.therapists?.[user?._id]) || null
          },
    [
      groupFullData?.therapists,
      isAdmin,
      user?._id,
      user?.email,
      user?.firstName,
      user?.lastName
    ]
  )

  // [CLEAN_FUNCTIONS]
  const onDateChange = async (e, field, amount) => {
    const value = e.target.value
    if (value) {
      // Set calculated day into dependent input.
      form.setFieldsValue({
        [field]: moment(value)
          .add(amount, 'days')
          .set('hour', 12)
          .format(MOMENT_FORMAT_FOR_TIMEPICKER)
      })
      // Validate dependent field to show error if calculated day are forbidden.
      try {
        const value = await form.validateFields([field])
        const fieldName = Object.keys(value)[0]
        if (groupId && value) {
          await update({
            collection: GROUPS_MODEL_NAME,
            id: groupId,
            data: {
              [fieldName]: firebase.firestore.Timestamp.fromDate(
                moment(value[fieldName]).set('hour', 12).toDate()
              )
            }
          })
          createActivity({
            isTriggeredByAdmin: isAdmin,
            type: EDIT_GROUP,
            groupId: groupId || id || groupFullData?._id || null,
            additionalData: {
              ...triggeredByActivityData,
              groupName: groupFullData?.weekNumber || null,
              groupStatus: groupFullData?.status || null,
              groupClinicName: groupFullData?.clinic?.name || null,
              groupStudyName: groupFullData?.study?.name || null,
              groupDisorderName: groupFullData?.disorder?.name || null
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

        // Select therapists with selected study.
        if (therapistProfileData.studies.includes(value)) {
          therapistsIds.push(therapistData._id)
        }
      }

      // remove therapists which don't have selected study.
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

      createActivity({
        isTriggeredByAdmin: isAdmin,
        type: EDIT_GROUP,
        groupId: groupId || groupFullData?._id || null,
        additionalData: {
          ...triggeredByActivityData,
          groupName: groupFullData?.weekNumber || null,
          groupStatus: groupFullData?.status || null,
          groupClinicName: groupFullData?.clinic?.name || null,
          groupStudyName: groupFullData?.study?.name || null,
          groupDisorderName: groupFullData?.disorder?.name || null
        }
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

      createActivity({
        isTriggeredByAdmin: isAdmin,
        type: EDIT_GROUP,
        groupId: groupId || groupFullData?._id || null,
        additionalData: {
          ...triggeredByActivityData,
          groupName: groupFullData?.weekNumber || null,
          groupStatus: groupFullData?.status || null,
          groupClinicName: groupFullData?.clinic?.name || null,
          groupStudyName: groupFullData?.study?.name || null,
          groupDisorderName: groupFullData?.disorder?.name || null
        }
      })
    }
  }

  const saveData = async (value, data) => {
    const therapists = form.getFieldValue('therapists') || {}

    const prepareData = {
      ...value,
      therapists,
      weekNumber: moment(data.firstDay).week(),
      status: DRAFT_STATUS
    }
    const clinicId = selectedClinic || form.getFieldValue('clinicId')
    const studyId = selectedStudy || form.getFieldValue('studyId')

    // If clinic selected add it to draft data.
    if (clinicId) {
      prepareData.clinicId = clinicId
    }
    if (studyId) {
      prepareData.studyId = studyId
    }
    if (!groupId) {
      const docId = await save({
        collection: GROUPS_MODEL_NAME,
        data: prepareData
      })

      createActivity({
        isTriggeredByAdmin: isAdmin,
        type: CREATE_GROUP,
        groupId: docId || groupId || groupFullData?._id || null,
        additionalData: {
          ...triggeredByActivityData,
          groupName: prepareData?.weekNumber,
          groupStatus: prepareData?.status,
          groupClinicName: groupFullData?.clinic?.name || null,
          groupStudyName: groupFullData?.study?.name || null,
          groupDisorderName: groupFullData?.disorder?.name || null
        }
      })
      return setGroupId(docId)
    }
    await update({
      collection: GROUPS_MODEL_NAME,
      id: groupId,
      data: prepareData
    })

    createActivity({
      isTriggeredByAdmin: isAdmin,
      type: EDIT_GROUP,
      groupId: groupId || groupFullData?._id || null,
      additionalData: {
        ...triggeredByActivityData,
        groupName: groupFullData?.weekNumber || null,
        groupStatus: groupFullData?.status || null,
        groupClinicName: groupFullData?.clinic?.name || null,
        groupStudyName: groupFullData?.study?.name || null,
        groupDisorderName: groupFullData?.disorder?.name || null
      }
    })
  }

  const draftSave = async (value, data) => {
    // Get field which was changed.
    const changedFieldName = Object.keys(value)[0]

    // If there was date fields format it to save firestore timestamp not string.
    if (['fourthDay', 'firstDay'].includes(changedFieldName)) {
      value[changedFieldName] = firebase.firestore.Timestamp.fromDate(
        moment(value[changedFieldName]).set('hours', 12).toDate()
      )
    }

    // Patients has own implementation of draft save.
    if (changedFieldName === 'patients') {
      return
    }

    // Validate changed field if has no errors save it to firestore.
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
    const fourthDay = moment().add(NEXT_COLLECT_DIFF, 'days').set(12, 'hours')

    // find next combination of days which are not forbidden
    while (WRONG_FOURTH_DAYS.includes(fourthDay.locale('en').format('ddd'))) {
      fourthDay.add(1, 'days')
    }

    form.setFieldsValue({
      firstDay: fourthDay
        .subtract(NEXT_COLLECT_DIFF, 'days')
        .format(MOMENT_FORMAT_FOR_TIMEPICKER),
      fourthDay: fourthDay
        .add(NEXT_COLLECT_DIFF, 'days')
        .format(MOMENT_FORMAT_FOR_TIMEPICKER)
    })
  }

  /* After initial values get into component
   * update selected study if it in initial values.
   */
  useEffect(() => {
    form.setFieldsValue(initialValues)
    if (initialValues.studyId) {
      setSelectedStudy(initialValues.studyId)
    }
    // On form init - check if current day is not forbidden.
    if (!initialValues?.firstDay) {
      checkInitialDate()
    }
  }, [initialValues])

  return (
    <Form
      {...props}
      onFinish={(data) => onFinish({ ...data, _id: groupId })}
      form={form}
      onValuesChange={draftSave}>
      <Row noGutters>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Clinic')}</Text>
          <Form.Item
            name="clinicId"
            initialValue={bioflowAccess ? clinicId : null}
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
                <Tooltip title={t('Available days: Mon, Tue')}>
                  <Icon
                    {...exclamationIconStyles}
                    component={<ExclamationCircleOutlined />}
                  />
                </Tooltip>
              </Box>
              <Form.Item
                name="firstDay"
                rules={[
                  {
                    require: true,
                    message: t('Enter start day, please')
                  },
                  {
                    validator: (_, value) =>
                      CORRECT_FIRST_DAYS.includes(
                        moment(value).locale('en').format('ddd')
                      )
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('Select correct day')))
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Start day')}
                  onChange={(e) => onDateChange(e, 'fourthDay', 3)}
                  min={DEFAULT_VALUE_FOR_DATEPICKERS.firstDay}
                />
              </Form.Item>
            </Col>

            <Col cw={[12, 12, 6]} mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <Text mr={2}>{t('Fourth day')}</Text>
                <Tooltip title={t('Available days: Thu, Fri')}>
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
                      WRONG_FOURTH_DAYS.includes(
                        moment(value).locale('en').format('ddd')
                      )
                        ? Promise.reject(new Error(t('Select correct day')))
                        : Promise.resolve()
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Fourth day')}
                  onChange={(e) =>
                    onDateChange(e, 'firstDay', -NEXT_COLLECT_DIFF)
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
  studyQuery: PropTypes.object,
  loading: PropTypes.bool,
  id: PropTypes.string, // need on edit routes
  submitText: PropTypes.string
}

export default GroupSimpleForm
