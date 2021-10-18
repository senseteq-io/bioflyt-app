import React from 'react'
import { Box, Col, Row, Text } from '@qonsoll/react-design'
import { Tooltip } from 'antd'
import { useTranslations } from '@qonsoll/translation'

function ActivitySimpleView(props) {
  const {
    isGroupActivity,
    time = '14:15',
    message = 'Some mock action',
    clinic = 'mock',
    group = 'mock2'
  } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  const tooltipContent = (
    <>
      <Box>
        {t('clinic')}: {clinic}
      </Box>
      <Box>
        {t('group')}: {group}
      </Box>
    </>
  )

  return (
    <Row noOuterGutters my={0}>
      <Col cw="auto" v="center">
        <Text type="secondary">{time}</Text>
      </Col>
      <Col v="center">
        <Text type="secondary">{message}</Text>
      </Col>
      {!isGroupActivity && (
        <Col cw="auto" v="center">
          <Tooltip placement="topRight" title={tooltipContent}>
            <Text underline type="secondary" cursor="help">
              {t('details')}
            </Text>
          </Tooltip>
        </Col>
      )}
    </Row>
  )
}

ActivitySimpleView.propTypes = {}

export default ActivitySimpleView
