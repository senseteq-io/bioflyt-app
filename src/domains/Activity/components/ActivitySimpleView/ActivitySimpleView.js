import firebase from 'firebase'
import React from 'react'
import moment from 'moment'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useTranslations } from '@qonsoll/translation'
import { Tooltip } from 'antd'
import { Box, Col, Row, Text } from '@qonsoll/react-design'
import { CLINICS_MODEL_NAME } from 'app/constants/models'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'

function ActivitySimpleView(props) {
  const { isGroupActivity, _createdAt, text, clinicId, groupId } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  // [DATA_FETCH]
  const [clinicData] = useDocumentDataOnce(
    firebase.firestore().collection(CLINICS_MODEL_NAME).doc(clinicId)
  )
  const [groupData] = useDocumentDataOnce(
    firebase.firestore().collection(GROUPS_MODEL_NAME).doc(groupId)
  )
  const tooltipContent = (
    <>
      <Box>
        {t('clinic')}: {clinicData?.name || ''}
      </Box>
      <Box>
        {t('group')}: {t('week')}
        {groupData?.weekNumber || ''}
      </Box>
    </>
  )

  return (
    <Row noOuterGutters my={0}>
      <Col cw="auto" v="center">
        <Text type="secondary">
          {moment(_createdAt.toDate?.()).format('HH:mm')}
        </Text>
      </Col>
      <Col v="center">
        <Text type="secondary">{text}</Text>
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
