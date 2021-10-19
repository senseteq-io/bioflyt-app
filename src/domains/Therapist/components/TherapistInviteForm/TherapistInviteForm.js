import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { Col, Row, Text } from '@qonsoll/react-design'
import { Form } from 'antd'
function TherapistInviteForm(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  return (
    <Form>
      <Row>
        <Col>
          <Text>{t('')}TherapistInviteForm</Text>
        </Col>
      </Row>
    </Form>
  )
}

TherapistInviteForm.propTypes = {}

export default TherapistInviteForm
