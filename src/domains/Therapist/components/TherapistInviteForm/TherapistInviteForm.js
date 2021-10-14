import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { Button, Col, Row, Title } from '@qonsoll/react-design'
import { PlusOutlined } from '@ant-design/icons'

function TherapistInviteForm(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  return (
    <Row noGutters>
      <Col cw={6} v="center">
        <Title level={4}>{t('Therapists')}</Title>
      </Col>
      <Col cw={6} h="right">
        <Button icon={<PlusOutlined />} />
      </Col>
      <Col cw={12}></Col>
    </Row>
  )
}

TherapistInviteForm.propTypes = {}

export default TherapistInviteForm
