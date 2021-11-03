import React, { useEffect } from 'react'
import { Form, Tooltip } from 'antd'
import { Box, Button, Col, Icon, Input, Row, Text } from '@qonsoll/react-design'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useTranslations } from '@qonsoll/translation'
import { useHistory } from 'react-router'
import moment from 'moment'

const WRONG_DAYS = ['Sat', 'Sun']
const MOMENT_FORMAT_FOR_TIMEPICKER = 'YYYY-MM-DD'
const DEFAULT_VALUE_FOR_DATEPICKER = moment()
  .add(3, 'months')
  .format(MOMENT_FORMAT_FOR_TIMEPICKER)
const exclamationIconStyles = {
  cursor: 'help',
  color: 'var(--ql-color-accent1)',
  display: 'flex',
  size: 'medium'
}

const PatientSimpleForm = (props) => {
  const { submitBtnText, onSubmit, onCancel } = props

  //[ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const [form] = Form.useForm()

  //[CLEAN FUNCTIONS]
  const onFinish = (values) => {
    onSubmit?.(values)
  }

  //[USE EFFECTS]
  useEffect(() => {
    form.setFieldsValue({ threeMonthDay: DEFAULT_VALUE_FOR_DATEPICKER })
    const threeMonthDay = moment().add(3, 'months')

    // find next combination of days which are not forbidden
    while (WRONG_DAYS.includes(threeMonthDay.format('ddd'))) {
      threeMonthDay.add(1, 'days')
    }

    form.setFieldsValue({
      threeMonthDay: threeMonthDay.format(MOMENT_FORMAT_FOR_TIMEPICKER)
    })
  }, [])

  return (
    <Form {...props} form={form} onFinish={onFinish}>
      <Row noGutters>
        <Col cw={12} mb={1}>
          <Box display="flex" alignItems="center">
            <Text type="secondary" mr={2}>
              {t('Select date for three month visit')}
            </Text>
            <Tooltip title={t('Available days: weekdays')}>
              <Icon
                {...exclamationIconStyles}
                component={<ExclamationCircleOutlined />}
              />
            </Tooltip>
          </Box>
        </Col>
        <Col cw={12} mb={4}>
          <Form.Item
            name="threeMonthDay"
            rules={[
              {
                require: true,
                message: t('Select three month day, please')
              },
              {
                validator: (_, value) =>
                  !WRONG_DAYS.includes(moment(value).format('ddd'))
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('Select correct day')))
              }
            ]}>
            <Input
              type="date"
              placeholder={t('Three month day')}
              min={DEFAULT_VALUE_FOR_DATEPICKER}
            />
          </Form.Item>
        </Col>
        <Col>
          <Row h="right" noGutters>
            <Col cw="auto" mr={3}>
              <Button size="middle" type="text" onClick={onCancel}>
                {t('Cancel')}
              </Button>
            </Col>
            <Col cw="auto">
              <Button size="middle" type="primary" onClick={form.submit}>
                {submitBtnText || t('Save')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}
export default PatientSimpleForm
