import { List, notification } from 'antd'

import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Input,
  Remove,
  Row,
  Title
} from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'

const PatientAddForm = (props) => {
  const { value, onChange } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [CLEAN_FUNCTIONS]
  const onInputChange = (e, field, index) => {
    value[index][field] = e.target.value
    onChange?.(value)
  }
  const addPatient = () => {
    if (value?.length < 6 || !value) {
      onChange?.(value ? [...value, {}] : [{}])
    } else {
      notification.warn({
        message: `${t('Each group can have only 6 patients')}.`
      })
    }
  }
  const removePatient = () => onChange(value.filter((_, i) => i !== index))

  return (
    <Row noGutters>
      <Col cw={6} v="center">
        <Title level={4}>{t('Patients')}</Title>
      </Col>
      <Col cw={6} h="right">
        <Button icon={<PlusOutlined />} onClick={addPatient} />
      </Col>
      <Col cw={12}>
        <List
          itemLayout="horizontal"
          dataSource={value}
          renderItem={({ firstName, lastName }, index) => {
            return (
              <List.Item>
                <Card size="small" width="100%">
                  <Row v="center" noGutters>
                    <Col mr={3}>
                      <Input
                        value={firstName}
                        placeholder={t('First name')}
                        onChange={(e) => onInputChange(e, 'firstName', index)}
                      />
                    </Col>
                    <Col mr={3}>
                      <Input
                        value={lastName}
                        placeholder={t('Last name')}
                        onChange={(e) => onInputChange(e, 'lastName', index)}
                      />
                    </Col>
                    <Col h="right" cw="auto">
                      <Remove icon onSubmit={removePatient} />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )
          }}
        />
      </Col>
    </Row>
  )
}

PatientAddForm.propTypes = {}

export default PatientAddForm
