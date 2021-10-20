import React, { Fragment, useState } from 'react'
import { Tooltip } from 'antd'
import { Box, Card, Col, Row, Switch, Text, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { ClinicDrawerView } from '..'

function ClinicSimpleView(props) {
  const { name, places = ['Oslo', 'Bergen', 'Kyiv', 'Khmelnitskiy'] } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  //[COMPONENT STATE HOOKS]
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (isBioflowEnabled) => {}

  const onDrawerOpen = () => {
    setIsDrawerVisible(true)
  }

  const onDrawerClose = () => {
    setIsDrawerVisible(false)
  }

  return (
    <Fragment>
      <Card
        size="small"
        bordered={false}
        shadowless
        bg="var(--ql-color-dark-t-lighten6)"
        cursor="pointer"
        onClick={onDrawerOpen}>
        <Row v="center" noOuterGutters>
          <Col cw={9}>
            <Row noGutters>
              <Col cw={12} mb={2}>
                <Tooltip title={name}>
                  <Title variant="h5" isEllipsis>
                    {name}
                  </Title>
                </Tooltip>
              </Col>
              <Col cw={12}>
                <Text isEllipsis variant="caption1">
                  {places?.join(', ')}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col cw={3} v="center" pl={0}>
            <Box
              display="flex"
              justifyContent="end"
              onClick={(e) => e.stopPropagation()}>
              <Tooltip
                title={`${t(
                  'Allows to enable or disable Bioflow functionality for this clinic'
                )}.`}>
                <Switch
                  checkedChildren={t('on')}
                  unCheckedChildren={t('off')}
                  defaultChecked={false}
                  onChange={onSwitchValueChange}
                />
              </Tooltip>
            </Box>
          </Col>
        </Row>
      </Card>

      <ClinicDrawerView
        visible={isDrawerVisible}
        onDrawerClose={onDrawerClose}
        clinicName={name}
        clinicPlaces={places}
      />
    </Fragment>
  )
}

ClinicSimpleView.propTypes = {}

export default ClinicSimpleView
