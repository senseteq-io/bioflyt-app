import React from 'react'
import { Tooltip } from 'antd'
import { Col, Divider, Row, Switch, Text } from '@qonsoll/react-design'
import { useTranslations } from '../../../../contexts/Translation'

function ClinicSimpleView(props) {
  const { clinic } = props
  const { name } = clinic || {}

  // [ADDITIONAL HOOKS]
  const t = useTranslations()

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (isBioflowEnabled) => {}

  return (
    <Row width="100%">
      <Col cw={12}>
        <Row noGutters>
          <Col>
            <Text type="secondary">{name}</Text>
          </Col>
          <Col cw="auto">
            <Tooltip
              title={t(
                'Allows to enable or disable Bioflow functionality for this clinic'
              )}>
              <Switch defaultChecked={false} onChange={onSwitchValueChange} />
            </Tooltip>
          </Col>
        </Row>
      </Col>
      <Col cw={12}>
        <Row noGutters>
          <Col cw={12}>
            <Divider my={2} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

ClinicSimpleView.propTypes = {}

export default ClinicSimpleView
