import { List, notification } from 'antd'
import firebase from 'firebase'

import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import {
  Box,
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
  const onInputChange = (e, index) => {
    if (e.target.value.match(/^[A-Za-z]+$/) || e.target.value === '') {
      value[index].initial = e.target.value
      onChange?.([...value])
    }
  }
  const addPatient = () => {
    if (value?.length < 6 || !value) {
      const id = firebase.firestore().collection('test').doc().id
      onChange?.(value ? [...value, { id }] : [{ id }])
    } else {
      notification.warn({
        message: `${t('Each group can have only 6 patients')}.`
      })
    }
  }
  const removePatient = (patientId) =>
    onChange?.(value.filter(({ id }) => id !== patientId))

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
          renderItem={({ initial, id }, index) => (
            <List.Item key={id}>
              <Card
                size="small"
                bordered={false}
                shadowless
                bg="var(--ql-color-dark-t-lighten6)"
                width="100%">
                <Box display="flex">
                  <Input
                    value={initial}
                    placeholder={t('Initials')}
                    onChange={(e) => onInputChange(e, index)}
                    mr={3}
                  />
                  <Remove icon onSubmit={() => removePatient(id)} type="text" />
                </Box>
              </Card>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}

PatientAddForm.propTypes = {}

export default PatientAddForm
