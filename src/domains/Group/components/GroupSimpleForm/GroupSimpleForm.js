import { ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useCallback, useMemo, useState, memo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
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
import { useSaveData } from 'app/hooks'
import { useClinicContext } from 'app/domains/Clinic/contexts'
import { TherapistAddForm } from 'bioflow/domains/Therapist/components'
import { PatientAddForm } from 'bioflow/domains/Patient/components'
import { DisorderSelect } from 'app/domains/Disorder/components'
import { ClinicSelect } from 'bioflow/domains/Clinic/components'
import { StudySelect } from 'bioflow/domains/Study/components'
import { DRAFT_STATUS } from 'bioflow/constants/groupStatuses'
import { CLINICS_MODEL_NAME } from 'app/constants/models'
import { GROUPS } from 'bioflow/constants/collections'

const exclamationIconStyles = {
  cursor: 'help',
  color: 'var(--ql-color-accent1)',
  display: 'flex',
  size: 'medium'
}

function GroupSimpleForm(props) {
  const { loading, submitText } = props

  // [ADDITIONAL_HOOKS]
  const [groupForm] = Form.useForm()
  const history = useHistory()
  const { t } = useTranslations()
  const { id } = useParams()
  const { _id: clinicId, bioflowAccess } = useClinicContext()
  const { save, update } = useSaveData()

  // [COMPONENT_STATE_HOOKS]
  const [selectedClinic, setSelectedClinic] = useState(
    props?.initialValues?.clinicId || (bioflowAccess && clinicId)
  )
  const [groupId, setGroupId] = useState(id)

  // [COMPUTED_PROPERTIES]
  const form = useMemo(() => props.form || groupForm, [groupForm, props.form])

  // [CLEAN_FUNCTIONS]
  const onDateChange = (e, field, amount) => {
    const value = e.target.value
    form.setFieldsValue({
      [field]: moment(value).add(amount, 'day').format('yyyy-MM-DD')
    })
    form.validateFields([field])
  }

  const resetClinic = (value) => {
    const resetedFields = { therapists: [], disorderId: null }
    form.setFieldsValue(resetedFields)
    if (groupId || id) {
      update({
        collection: GROUPS,
        id: groupId || id,
        data: resetedFields,
        withNotification: true
      })
    }
    setSelectedClinic(value)
  }

  const draftSave = useCallback(
    async (value, data) => {
      const saveData = async () => {
        if (!groupId) {
          const docId = await save({
            collection: GROUPS,
            data: {
              ...value,
              weekNumber: moment(data.startDay).week(),
              status: 'DRAFT'
            }
          })
          return setGroupId(docId)
        }
        await update({
          collection: GROUPS,
          id: groupId || id,
          data: value
        })
      }

      try {
        await form.validateFields(Object.keys(value))
        saveData()
      } catch (error) {
        console.log(error)
        const { errorFields } = error
        if (!errorFields.length) {
          saveData()
        }
      }
    },

    [groupId]
  )

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
              query={firebase
                .firestore()
                .collection(CLINICS_MODEL_NAME)
                .where('bioflowAccess', '==', true)}
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
            <StudySelect placeholder={t('Select study')} />
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
                <Tooltip title={t('Available days: Mon, Thu, Fri')}>
                  <Icon
                    {...exclamationIconStyles}
                    component={<ExclamationCircleOutlined />}
                  />
                </Tooltip>
              </Box>
              <Form.Item
                name="startDay"
                initialValue={moment().format('yyyy-MM-DD')}
                rules={[
                  {
                    require: true,
                    message: t('Enter start day, please')
                  },
                  {
                    validator: (_, value) =>
                      ['Mon', 'Thu', 'Fri'].includes(
                        moment(value).format('ddd')
                      )
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('Select correct day')))
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Start day')}
                  onChange={(e) => onDateChange(e, 'fourthDay', 4)}
                  min={moment().format('YYYY-MM-DD')}
                />
              </Form.Item>
            </Col>

            <Col cw={[12, 12, 6]} mb={3}>
              <Text mb={2}>{t('Fourth day')}</Text>
              <Form.Item
                name="fourthDay"
                initialValue={moment().add(4, 'day').format('yyyy-MM-DD')}
                rules={[
                  {
                    require: true,
                    message: t('Enter fourth day, please')
                  },
                  {
                    validator: (_, value) =>
                      ['Sun', 'Sat', 'Thu', 'Wed'].includes(
                        moment(value).format('ddd')
                      )
                        ? Promise.reject(new Error(t('Select correct day')))
                        : Promise.resolve()
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Fourth day')}
                  onChange={(e) => onDateChange(e, 'startDay', -4)}
                  min={moment().add(4, 'days').format('YYYY-MM-DD')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item name="therapists">
            <TherapistAddForm
              clinicId={selectedClinic}
              disabled={!selectedClinic}
            />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item name="patients">
            <PatientAddForm />
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
        {props.initialValues?.status === DRAFT_STATUS && (
          <Col cw="auto" mr={3}>
            <Remove
              icon
              size="middle"
              type="text"
              onSubmit={async () => {
                await firebase
                  .firestore()
                  .collection(GROUPS)
                  .doc(props.initialValues._id)
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

GroupSimpleForm.propTypes = {}

export default memo(GroupSimpleForm)
