import { useClinicContext } from 'app/domains/Clinic/contexts'
import { GROUPS } from 'bioflow/constants/collections'
import { DRAFT_STATUS } from 'bioflow/constants/groupStatuses'
import React, { useState } from 'react'
import firebase from 'firebase'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Form } from 'antd'
import { Button, Col, Input, Remove, Row, Text } from '@qonsoll/react-design'
import { DisorderSelect } from 'app/domains/Disorder/components'
import { ClinicSelect } from 'bioflow/domains/Clinic/components'
import { TherapistAddForm } from 'bioflow/domains/Therapist/components'
import { PatientAddForm } from 'bioflow/domains/Patient/components'
import { StudySelect } from 'bioflow/domains/Study/components'
import { CLINICS_MODEL_NAME } from 'app/constants/models'

function GroupSimpleForm(props) {
  const { loading, submitText } = props

  // [ADDITIONAL_HOOKS]
  const [groupForm] = Form.useForm()
  const history = useHistory()
  const { t } = useTranslations()
  // const { id } = useParams()
  const { _id: clinicId, bioflowAccess } = useClinicContext()
  // const { save, update } = useSaveData()

  // [COMPONENT_STATE_HOOKS]
  const [selectedClinic, setSelectedClinic] = useState(
    props?.initialValues?.clinicId || (bioflowAccess && clinicId)
  )
  // const [groupId, setGroupId] = useState()
  const form = props.form || groupForm

  // [CLEAN_FUNCTIONS]
  const onDateChange = (e, field, amount) => {
    const value = e.target.value
    form.setFieldsValue({
      [field]: moment(value).add(amount, 'day').format('yyyy-MM-DD')
    })
  }

  return (
    <Form {...props} form={form} onFieldsChange={console.log}>
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
              onChange={(value) => {
                form.setFieldsValue({ therapists: [] })
                setSelectedClinic(value)
              }}
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
              <Text mb={2}>{t('Start day')}</Text>
              <Form.Item
                name="startDay"
                initialValue={moment().format('yyyy-MM-DD')}
                rules={[
                  {
                    require: true,
                    message: t('Enter start day, please')
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Start day')}
                  onChange={(e) => onDateChange(e, 'fourthDay', 4)}
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
                  }
                ]}>
                <Input
                  type="date"
                  placeholder={t('Fourth day')}
                  onChange={(e) => onDateChange(e, 'startDay', -4)}
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

export default GroupSimpleForm
