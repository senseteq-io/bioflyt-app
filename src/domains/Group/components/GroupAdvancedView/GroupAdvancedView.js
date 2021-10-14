import {
  BIOFLOW_ADMIN_GROUP_SHOW_PATH,
  BIOFLOW_GROUP_SHOW_PATH
} from 'bioflow/constants/paths'
import { useBioflowAccess } from 'bioflow/hooks'
import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { useHistory, generatePath } from 'react-router-dom'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Box, Card, Col, Row, Text, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { useService } from 'bioflow/contexts/Service'

function GroupAdvancedView(props) {
  const {
    _id,
    weekNumber,
    clinicId,
    disorderId,
    studyId,
    patients,
    status,
    place
  } = props

  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } = useService()
  const { isAdmin } = useBioflowAccess()

  // [DATA_FETCH]
  const [clinicData] = useDocumentDataOnce(
    firebase.firestore().collection(CLINICS_MODEL_NAME).doc(clinicId)
  )
  const [disorderData] = useDocumentDataOnce(
    firebase.firestore().collection(DISORDERS_MODEL_NAME).doc(disorderId)
  )

  // [CLEAN_FUNCTIONS]
  const goToGroup = () =>
    history.push(
      generatePath(
        isAdmin ? BIOFLOW_ADMIN_GROUP_SHOW_PATH : BIOFLOW_GROUP_SHOW_PATH,
        { id: _id }
      )
    )
  return (
    <Card onClick={goToGroup} cursor="pointer">
      <Row>
        <Col h="center" v="center" cw="auto">
          {t('Week')} <Title level={2}>{weekNumber}</Title>
        </Col>
        <Col>
          <Text>
            {clinicData?.name}
            {` (${place})` || ''}
          </Text>
          <Text>{studyId || ''}</Text>
          <Text>{disorderData?.name || ''}</Text>
        </Col>
        <Col v="center">
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            width="fit-content">
            {t('Patients')} <Title level={2}>{patients.length}</Title>
          </Box>
        </Col>
        <Col v="center" h="right">
          <Title level={3}>{status}</Title>
        </Col>
      </Row>
    </Card>
  )
}

GroupAdvancedView.propTypes = {
  _id: PropTypes.string.isRequired,
  clinicId: PropTypes.string.isRequired,
  weekNumber: PropTypes.number.isRequired,
  studyId: PropTypes.string.isRequired,
  disorderId: PropTypes.string.isRequired,
  patients: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default GroupAdvancedView
