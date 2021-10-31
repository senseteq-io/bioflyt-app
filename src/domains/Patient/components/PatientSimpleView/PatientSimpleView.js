import React from 'react'
import moment from 'moment'
import { useTranslations } from '@qonsoll/translation'
import { Tooltip } from 'antd'
import { Box, Button, Card, Icon, Text } from '@qonsoll/react-design'
import { CheckOutlined } from '@ant-design/icons'
import { useBioflowAccess } from 'bioflow/hooks'

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
  const { isAdmin } = useBioflowAccess()

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
          <Text isEllipsis pr={3}>
            {name}
          </Text>
        </Tooltip>
        <Box>
          {!(firstDayBIOCollect || fourthDayBIOCollect || lastBIOCollect) && (
            <Tooltip title={isAdmin && "Admin can't collect BIO"}>
              <Box>
                <Button
                  ghost
                  type="primary"
                  onClick={() => onDeliverBio(props)}
                  disabled={!isBIOCollectEnabled || isAdmin}>
                  {t('Deliver Bio')}
                </Button>
              </Box>
            </Tooltip>
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
