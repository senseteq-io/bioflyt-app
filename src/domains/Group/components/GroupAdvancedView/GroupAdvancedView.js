import { Badge, Tooltip } from 'antd'
import { STUDIES } from 'bioflow/constants/collections'
import {
  BIOFLOW_ADMIN_GROUP_EDIT_PATH,
  BIOFLOW_ADMIN_GROUP_SHOW_PATH,
  BIOFLOW_GROUP_EDIT_PATH,
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

const STATUS_COLOR_MAP = {
  DRAFT: 'gray',
  ONGOING: 'green',
  FUTURE: 'orange',
  FINISHED: 'red'
}

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
    disorderId &&
      firebase.firestore().collection(DISORDERS_MODEL_NAME).doc(disorderId)
  )
  const [studyData] = useDocumentDataOnce(
    studyId && firebase.firestore().collection(STUDIES).doc(studyId)
  )

  // [CLEAN_FUNCTIONS]
  const goToGroup = () => {
    if (status === 'DRAFT') {
      return history.push(
        generatePath(
          isAdmin ? BIOFLOW_ADMIN_GROUP_EDIT_PATH : BIOFLOW_GROUP_EDIT_PATH,
          { id: _id }
        )
      )
    }
    history.push(
      generatePath(
        isAdmin ? BIOFLOW_ADMIN_GROUP_SHOW_PATH : BIOFLOW_GROUP_SHOW_PATH,
        { id: _id }
      )
    )
  }

  return (
    <Badge.Ribbon text={status} color={STATUS_COLOR_MAP[status]}>
      <Card
        size="small"
        bordered={false}
        shadowless
        bg="var(--ql-color-dark-t-lighten6)"
        onClick={goToGroup}
        cursor="pointer">
        <Row>
          <Col h="left" v="center" cw={[2, 2, 2, 3]}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text>{t('Week')}</Text> <Title level={2}>{weekNumber}</Title>
            </Box>
          </Col>
          <Col>
            <Row noGutters>
              <Col flexDirection="row" cw={12}>
                <Text
                  whiteSpace="noWrap"
                  type="secondary"
                  fontWeight="var(--ql-font-weight-medium)"
                  mr={1}>
                  {t('Clinic')}:
                </Text>
                <Text>
                  {clinicData?.name}
                  {place ? ` (${place})` : ''}
                </Text>
              </Col>
              <Col flexDirection="row" cw={12}>
                <Text
                  whiteSpace="noWrap"
                  type="secondary"
                  fontWeight="var(--ql-font-weight-medium)"
                  mr={1}>
                  {t('Study')}:
                </Text>
                <Text>{studyData?.name || t('Not selected')}</Text>
              </Col>
              <Col flexDirection="row" cw={12}>
                <Text
                  whiteSpace="noWrap"
                  type="secondary"
                  fontWeight="var(--ql-font-weight-medium)"
                  mr={1}>
                  {t('Disorder')}:
                </Text>
                <Tooltip title={disorderData?.name || ''}>
                  <Text whiteSpace="noWrap" isEllipsis>
                    {disorderData?.name || t('Not selected')}
                  </Text>
                </Tooltip>
              </Col>
            </Row>
          </Col>
          <Col v="center" h="center">
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              width="fit-content">
              <Text
                whiteSpace="noWrap"
                type="secondary"
                fontWeight="var(--ql-font-weight-medium)"
                mr={1}>
                {t('Patients')}:
              </Text>
              <Title level={3}>{patients.length}</Title>
            </Box>
          </Col>
        </Row>
      </Card>
    </Badge.Ribbon>
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
