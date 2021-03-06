import React, { useRef } from 'react'
import { useTranslations } from '@qonsoll/translation'
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Text,
  PhoneInput
} from '@qonsoll/react-design'
import { Form, Select as AntSelect } from 'antd'
import { useHistory } from 'react-router-dom'

function TherapistInviteForm(props) {
  const { initialValues, onSubmit, studies, clinics } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const ref = useRef()
  const [form] = Form.useForm()
  const history = useHistory()

  // [CLEAN FUNCTIONS]
  const onFinish = (values) => {
    const { clinics } = values
    const clinicId = clinics[0]
    //convert array of clinic ids to object with fields id:true
    const formattedClinics = clinics?.reduce(
      (previous, current) => ({
        ...previous,
        [current]: true
      }),
      {}
    )
    onSubmit?.({ ...values, clinicId, clinics: formattedClinics })
  }

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }

  const handleKeyUp = (event) => {
    const currentFormFieldName = event.target?.id

    // Enter
    if (event.keyCode === 13) {
      ref.current.submit()
    } else {
      if (currentFormFieldName === 'email') {
        const currentEmailFieldValue = form.getFieldValue('email')

        form.setFields([
          {
            name: 'email',
            value: currentEmailFieldValue?.toLocaleLowerCase()
          }
        ])
      }
    }
  }

  return (
    <Form
      ref={ref}
      initialValues={initialValues}
      form={form}
      onKeyUp={handleKeyUp}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col cw={[12, 12, 6]} mb={24}>
          <Row noGutters>
            <Col cw={12} mb={1}>
              <Text>{t('First name')}</Text>
            </Col>
            <Col cw={12}>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: t('Please input first name!') }
                ]}>
                <Input
                  size="middle"
                  autoFocus
                  placeholder={t('Enter first name')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col cw={[12, 12, 6]} mb={24}>
          <Row noGutters>
            <Col cw={12} mb={1}>
              <Text>{t('Last name')}</Text>
            </Col>
            <Col cw={12}>
              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: t('Please input last name!') }
                ]}>
                <Input size="middle" placeholder={t('Enter last name')} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row mb={24}>
        <Col cw={12} mb={1}>
          <Text>{t('Phone number')}</Text>
        </Col>
        <Col>
          <Form.Item
            rules={[{ required: true, message: t('Please input phone!') }]}
            name="phone">
            <PhoneInput country="no" placeholder={t('Enter phone number')} />
          </Form.Item>
        </Col>
      </Row>
      <Row mb={24}>
        <Col cw={12} mb={1}>
          <Text>{t('Email')}</Text>
        </Col>
        <Col>
          <Form.Item
            rules={[
              {
                required: true,
                type: 'email',
                message: t('Please input email!')
              }
            ]}
            name="email">
            <Input size="middle" placeholder={t('Enter email')} />
          </Form.Item>
        </Col>
      </Row>
      <Row mb={24}>
        <Col cw={12} mb={1}>
          <Text>{t('Clinics')}</Text>
        </Col>
        <Col>
          <Form.Item
            name="clinics"
            rules={[
              {
                required: true,
                message: t('Please choose clinics!')
              }
            ]}>
            <Select
              mode="multiple"
              placeholder={t('Choose one or more clinics')}>
              {clinics?.map((clinic, index) => (
                <AntSelect.Option key={index} value={clinic?._id}>
                  {clinic?.name}
                </AntSelect.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row mb={4}>
        <Col cw={12} mb={1}>
          <Text>{t('Studies')}</Text>
        </Col>
        <Col>
          <Form.Item
            name="studies"
            rules={[
              {
                required: true,
                message: t('Please choose study!')
              }
            ]}>
            <Select
              mode="multiple"
              placeholder={t('Choose one or more studies')}>
              {studies?.map((study, index) => (
                <AntSelect.Option key={index} value={study?._id}>
                  {study?.name}
                </AntSelect.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row h="right" noInnerGutters>
        <Col cw="auto" mr={3}>
          <Button size="middle" type="text" onClick={() => history.goBack()}>
            {t('Cancel')}
          </Button>
        </Col>
        <Col cw="auto">
          <Button size="middle" type="primary" onClick={() => form.submit()}>
            {t('Invite')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

TherapistInviteForm.propTypes = {}

export default TherapistInviteForm
