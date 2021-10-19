import React, { useState } from 'react'
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
          {!isBioDelivered ? (
            <Button ghost type="primary" onClick={deliverBio}>
              {t('Deliver Bio')}
            </Button>
          ) : (
            <Icon {...successIconStyles} component={<CheckOutlined />} />
          )}
        </Box>
      </Box>
    </Card>
  )
}

PatientSimpleView.propTypes = {}

export default PatientSimpleView
