import React from 'react'
import { Button, Form, Input } from 'antd'
import { Row, Col, Text } from '@qonsoll/react-design'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'

function StudySimpleForm(props) {
  const { onSubmit, initialValues, submitBtnText, loading } = props

  // [ADDITIONAL HOOKS]
  const [form] = Form.useForm()
  const { t } = useTranslations()
  const history = useHistory()

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const onFinish = (values) => {
    onSubmit && onSubmit(values)
  }
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Row mb={4}>
        <Col cw={12} mb={1}>
          <Text>{t('Name')}</Text>
        </Col>
        <Col>
          <Form.Item
            rules={[
              { required: true, message: `${t('Please input study name')}!` }
            ]}
            name="name">
            <Input
              size="middle"
              placeholder={t('Enter study name')}
              autoFocus
            />
          </Form.Item>
        </Col>
      </Row>
      <Row h="right" noInnerGutters>
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
            onClick={form.submit}
            loading={loading}>
            {submitBtnText || t('Save')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

StudySimpleForm.propTypes = {}

export default StudySimpleForm
