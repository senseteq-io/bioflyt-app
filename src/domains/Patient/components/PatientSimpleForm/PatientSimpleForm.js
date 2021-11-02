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
  const { submitBtnText } = props

  //[ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const [form] = Form.useForm()

  //[CLEAN FUNCTIONS]
  const onFinish = () => {}

  useEffect(() => {
    form.setFieldsValue({ threeMonthDate: DEFAULT_VALUE_FOR_DATEPICKER })
    const threeMonthDate = moment().add(3, 'months')

    // find next combination of days which are not forbidden
    while (WRONG_DAYS.includes(threeMonthDate.format('ddd'))) {
      threeMonthDate.add(1, 'days')
    }

    form.setFieldsValue({
      threeMonthDate: threeMonthDate
        .add(1, 'days')
        .format(MOMENT_FORMAT_FOR_TIMEPICKER)
    })
  }, [])
  return (
    <Form {...props} form={form} onFinish={onFinish}>
      <Row noInnerGutters>
        <Col cw={12} mb={1}>
          <Text type="secondary">{t('Three month date')}</Text>
          <Box display="flex" alignItems="center" mb={2}>
            <Text mr={2}>{t('Start day')}</Text>
            <Tooltip title={t('Available days: weekdays')}>
              <Icon
                {...exclamationIconStyles}
                component={<ExclamationCircleOutlined />}
              />
            </Tooltip>
          </Box>
        </Col>
        <Col cw={12}>
          <Form.Item
            name="threeMonthDate"
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
      </Row>
      <Row h="right" noInnerGutters>
        <Col cw="auto" mr={3}>
          <Button size="middle" type="text" onClick={history.goBack}>
            {t('Cancel')}
          </Button>
        </Col>
        <Col cw="auto">
          <Button size="middle" type="primary" onClick={form.submit}>
            {submitBtnText || t('Save')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
export default PatientSimpleForm
