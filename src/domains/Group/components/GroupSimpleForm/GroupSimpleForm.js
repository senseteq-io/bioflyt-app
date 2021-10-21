import StudySelect from 'bioflow/domains/Study/components/StudySelect/StudySelect'
import moment from 'moment'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Form } from 'antd'
import { Button, Col, Input, Row, Text } from '@qonsoll/react-design'
import { DisorderSelect } from 'app/domains/Disorder/components'
import { ClinicSelect } from 'bioflow/domains/Clinic/components'
import { TherapistAddForm } from 'bioflow/domains/Therapist/components'
import { PatientAddForm } from 'bioflow/domains/Patient/components'

function GroupSimpleForm(props) {
  const { loading } = props

  // [ADDITIONAL_HOOKS]
  const [groupForm] = Form.useForm()
  const history = useHistory()
  const { t } = useTranslations()

  // [COMPONENT_STATE_HOOKS]
  const [selectedClinic, setSelectedClinic] = useState()

  const form = props.form || groupForm

  // [CLEAN_FUNCTIONS]
  const onDateChange = (e) => {
    const value = e.target.value
    form.setFieldsValue({
      endDay: moment(value).add(4, 'day').format('yyyy-MM-DD')
    })
  }

  return (
    <Form {...props} form={form}>
      <Row noGutters>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Clinic')}</Text>
          <Form.Item style={{ marginBottom: 0 }} name="clinicId">
            <ClinicSelect
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
          <Form.Item style={{ marginBottom: 0 }} name="studyId">
            <StudySelect placeholder={t('Select study')} />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Text mb={2}>{t('Disorder')}</Text>
          <Form.Item style={{ marginBottom: 0 }} name="disorderId">
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
                style={{ marginBottom: 0 }}
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
                  onChange={onDateChange}
                />
              </Form.Item>
            </Col>

            <Col cw={[12, 12, 6]} mb={3}>
              <Text mb={2}>{t('End day')}</Text>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="endDay"
                initialValue={moment().add(4, 'day').format('yyyy-MM-DD')}
                rules={[
                  {
                    require: true,
                    message: t('Enter end day, please')
                  }
                ]}>
                <Input type="date" placeholder={t('End day')} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item style={{ marginBottom: 0 }} name="therapists">
            <TherapistAddForm
              clinicId={form.getFieldValue('clinicId')}
              disabled={!selectedClinic}
            />
          </Form.Item>
        </Col>
        <Col cw={12} mb={3}>
          <Form.Item style={{ marginBottom: 0 }} name="patients">
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
        <Col cw="auto">
          <Button
            size="middle"
            type="primary"
            onClick={() => {
              const form = props.form || groupForm
              form.submit()
            }}
            loading={loading}>
            {t('Activate')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

GroupSimpleForm.propTypes = {}

export default GroupSimpleForm
