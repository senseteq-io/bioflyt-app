import React from 'react'
import { Tooltip } from 'antd'
import { Box, Card, Switch, Text, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'

function ClinicSimpleView(props) {
  const { name, location = 'Oslo' } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (isBioflowEnabled) => {}

  return (
    <Card
      size="small"
      bordered={false}
      shadowless
      bg="var(--ql-color-dark-t-lighten6)">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}>
        <Tooltip title={name}>
          <Title variant="h5" isEllipsis>
            {name}
          </Title>
        </Tooltip>

        <Tooltip
          title={t(
            'Allows to enable or disable Bioflow functionality for this clinic'
          )}>
          <Switch defaultChecked={false} onChange={onSwitchValueChange} />
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text type="secondary">{t('location')}:</Text>

        <Text>{location}</Text>
      </Box>
    </Card>
  )
}

ClinicSimpleView.propTypes = {}

export default ClinicSimpleView
