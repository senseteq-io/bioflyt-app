import moment from 'moment'
import React from 'react'
import { Box, Button, Card, Icon, Text } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { CheckOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

const successIconStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'var(--ql-color-success)',
  fontSize: 'var(--ql-typography-font-size-lg)',
  height: 'var(--btn-height-base)'
}

function PatientSimpleView(props) {
  const {
    name,
    startDay,
    fourthDay,
    firstDayBIOCollect,
    fourthDayBIOCollect,
    lastBIOCollect,
    onDeliverBio
  } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  const isBIOCollectEnabled =
    moment(startDay?.toDate()).format('DD-MM-YYYY') ===
      moment().format('DD-MM-YYYY') ||
    moment(fourthDay?.toDate()).format('DD-MM-YYYY') ===
      moment().format('DD-MM-YYYY')

  return (
    <Card
      shadowless
      bordered={false}
      size="small"
      bg="var(--ql-color-dark-t-lighten6)">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tooltip title={name}>
          <Text isEllipsis>{name}</Text>
        </Tooltip>
        <Box>
          {!(firstDayBIOCollect || fourthDayBIOCollect || lastBIOCollect) && (
            <Button
              ghost
              type="primary"
              onClick={() => onDeliverBio(props)}
              disabled={!isBIOCollectEnabled}>
              {t('Deliver Bio')}
            </Button>
          )}
          {(firstDayBIOCollect || fourthDayBIOCollect || lastBIOCollect) &&
            isBIOCollectEnabled && (
              <Tooltip
                title={`${t('Next bio collect on')} ${moment(
                  fourthDay?.toDate()
                ).format('DD MMM YYYY')}`}>
                <Icon {...successIconStyles} component={<CheckOutlined />} />
              </Tooltip>
            )}
        </Box>
      </Box>
    </Card>
  )
}

PatientSimpleView.propTypes = {}

export default PatientSimpleView
