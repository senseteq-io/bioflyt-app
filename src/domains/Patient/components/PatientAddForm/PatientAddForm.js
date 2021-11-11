import { List, notification } from 'antd'
import firebase from 'firebase'

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

const validateField = (value, callback) => {
  if (value.length <= 2) {
    if (/^[A-Za-z]+$/.test(value) || value === '') {
      callback(value)
    }
  }
  if (value.length === 3) {
    if (/^[A-Za-z0-9]$/.test(value[value.length - 1])) {
      callback(value)
    }
  }
}

const PatientAddForm = (props) => {
  const { value, onChange, form, saveData } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [CLEAN_FUNCTIONS]
  const onInputChange = (e, index) => {
    validateField(e.target.value, (initial) => {
      value[index].initial = initial
      onChange?.([...value])
    })
  }
  const saveDataToDB = (e, index) => {
    validateField(e.target.value, async (initial) => {
      value[index].initial = initial
      await saveData?.({ patients: [...value] }, form.getFieldsValue())
    })
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
  const removePatient = (patientId) => {
    const newPatientList = value.filter(({ id }) => id !== patientId)
    onChange?.(newPatientList)
    saveData?.({ patients: newPatientList }, form.getFieldsValue())
  }
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
                <Row noGutters>
                  <Col mr={2}>
                    <Input
                      max={3}
                      value={initial}
                      placeholder={t('Initials')}
                      onChange={(e) => onInputChange(e, index)}
                      mr={3}
                      onBlur={(e) => saveDataToDB(e, index)}
                    />
                  </Col>
                  <Col cw="auto">
                    <Remove
                      icon
                      onSubmit={() => removePatient(id)}
                      type="text"
                    />
                  </Col>
                </Row>
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
