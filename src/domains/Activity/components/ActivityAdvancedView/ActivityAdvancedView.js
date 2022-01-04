import React from 'react'
import { Box, Col, Divider, Row, Text } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'

const ActivityAdvancedView = (props) => {
  const { additionalData, additionalDataFields } = props

  //[ADDITIONAL HOOKS]
  const { t } = useTranslations()

  //[COMPUTED PROPERTIES]

  const additionalDataSorted = Object.keys(additionalData).filter((item)=>additionalDataFields?.[item] && additionalData?.[item]).sort()
 
  return (
    <Box mx={1}>
      {additionalDataSorted?.map((item, index) => (
        <Row key={index} noGutters mb={additionalDataSorted?.length !== index + 1 ? 3 : 0}>
          <Col cw={12} mb={1}>
            <Text type='secondary' variant="caption1">
              {additionalDataFields?.[item].toUpperCase()}
            </Text>
          </Col>
            
          <Col cw={12}>
            <Text>
              {item === 'groupName'
                ? `${t('Week')} ${additionalData?.[item]}`
                : additionalData?.[item]}
            </Text>
          </Col>
          {additionalDataSorted?.length !== index + 1 &&
          <Col cw={12}>
            <Divider my={2} />
          </Col>}
        </Row>
        ))}
    </Box>
  )
}

export default ActivityAdvancedView