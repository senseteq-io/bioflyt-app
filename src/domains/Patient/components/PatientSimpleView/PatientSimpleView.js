import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Icon,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { CheckOutlined } from '@ant-design/icons'

function PatientSimpleView(props) {
  const { name } = props || {}

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  // [COMPONENT STATE HOOKS]
  const [isBioDelivered, setIsBioDelivered] = useState(false)

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const deliverBio = () => {
    setIsBioDelivered(true)
  }
  return (
    <Card>
      <Row>
        <Col v="center">
          <Text type="secondary">{name}</Text>
        </Col>
        <Col v="center" cw={4}>
          <Button
            ghost
            type="primary"
            width="100%"
            onClick={deliverBio}
            fontSize={isBioDelivered && 'var(--ql-typography-font-size-lg)'}>
            {isBioDelivered ? <CheckOutlined /> : t('Deliver Bio')}
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

PatientSimpleView.propTypes = {}

export default PatientSimpleView
