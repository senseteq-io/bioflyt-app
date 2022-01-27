import { List } from 'antd'
import React from 'react'
import { Box, Card, Col, Row, Text, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'

const patientsMap = [0, 1, 2, 3, 4, 5]

const PatientAddForm = (props) => {
  const { value: patients, onChange, form, saveData } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [CLEAN_FUNCTIONS]
  const addPatient = async (number) => {
    const updatedPatients = patients || []
    if (patients?.map((item, index) => index + 1)?.includes(number)) {
      updatedPatients.splice(updatedPatients.length - 1, 1)
    } else {
      updatedPatients.push({
        threeMonthDay: null,
        firstDayBIOCollected: false,
        fourthDayBIOCollected: false,
        threeMonthDayBIOCollected: false
      })
    }
    onChange?.([...updatedPatients])
    await saveData?.({ patients: [...updatedPatients] }, form.getFieldsValue())
  }

  const checkIsActive = (currentPatientIndex) => {
    return patients
      ?.map((item, patientIndex) => patientIndex)
      ?.includes(currentPatientIndex)
  }

  return (
    <Row noGutters>
      <Col cw={6} v="center">
        <Title level={4}>{t('Patients')}</Title>
      </Col>

      <Col cw={12}>
        <List
          itemLayout="horizontal"
          dataSource={patientsMap.slice(
            patients?.length === 6 ? 0 : 5 - (patients?.length || 0)
          )}
          renderItem={(patient, index) => (
            <List.Item key={patient}>
              <Row width="100%" noGutters>
                <Col cw="auto" mr={16}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    width="48px"
                    height="100%"
                    bg={
                      checkIsActive(index)
                        ? 'var(--ql-color-accent1)'
                        : 'var(--ql-color-dark-t-lighten6)'
                    }>
                    <Text strong color={checkIsActive(index) && 'white'}>
                      {index + 1}
                    </Text>
                  </Box>
                </Col>
                <Col>
                  <Card
                    size="small"
                    bordered={false}
                    shadowless
                    bg={
                      checkIsActive(index)
                        ? 'var(--ql-color-accent1)'
                        : 'var(--ql-color-dark-t-lighten6)'
                    }
                    width="100%"
                    cursor="pointer"
                    onClick={() => addPatient(index + 1)}>
                    <Row noGutters>
                      <Col mr={2} v="center">
                        <Text strong color={checkIsActive(index) && 'white'}>
                          {t('Patient')} {index + 1}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}

PatientAddForm.propTypes = {}

export default PatientAddForm
