import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import _ from 'lodash'
import { useTranslations } from '@qonsoll/translation'
import { useHistory, generatePath } from 'react-router-dom'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Badge, Tooltip, Grid } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Box, Card, Col, Icon, Row, Text, Title } from '@qonsoll/react-design'
import { useBioflowAccess } from 'bioflow/hooks'
import { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } from 'app/constants/models'
import { STUDIES_MODEL_NAME } from 'bioflow/constants/collections'
import { DRAFT_STATUS } from 'bioflow/constants/groupStatuses'
import {
  BIOFLOW_ADMIN_GROUP_EDIT_PATH,
  BIOFLOW_ADMIN_GROUP_SHOW_PATH,
  BIOFLOW_GROUP_EDIT_PATH,
  BIOFLOW_GROUP_SHOW_PATH
} from 'bioflow/constants/paths'

const { useBreakpoint } = Grid

const exclamationIconStyles = {
  position: 'absolute',
  left: '100%',
  top: 0,
  cursor: 'help',
  color: 'var(--ql-color-danger)',
  display: 'flex',
  mr: 2,
  size: 'small'
}

const STATUS_COLOR_MAP = {
  DRAFT: '#c0c2c5',
  ONGOING: '#1d6fdc',
  FUTURE: '#550fcb',
  FINISHED: '#52c41a'
}

function GroupAdvancedView(props) {
  const {
    _id,
    weekNumber,
    clinicId,
    disorderId,
    studyId,
    patients,
    status
  } = props

  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { isAdmin } = useBioflowAccess()
  const screen = useBreakpoint()
  // [DATA_FETCH]
  const [clinicData] = useDocumentDataOnce(
    clinicId &&
      firebase.firestore().collection(CLINICS_MODEL_NAME).doc(clinicId)
  )
  const [disorderData] = useDocumentDataOnce(
    disorderId &&
      firebase.firestore().collection(DISORDERS_MODEL_NAME).doc(disorderId)
  )
  const [studyData] = useDocumentDataOnce(
    studyId && firebase.firestore().collection(STUDIES_MODEL_NAME).doc(studyId)
  )

  // [CLEAN_FUNCTIONS]
  const goToGroup = () => {
    if (status === DRAFT_STATUS) {
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
    <Badge.Ribbon
      text={
        <Text fontWeight={500} color="white">
          {t(_.upperFirst(_.toLower(status)))}
        </Text>
      }
      color={STATUS_COLOR_MAP[status]}>
      <Card
        size="small"
        bordered={false}
        shadowless
        bg="var(--ql-color-dark-t-lighten6)"
        onClick={goToGroup}
        cursor="pointer">
        <Row>
          <Col h="left" v="center" cw={[2, 2, 2, 3]} mr={screen.xs && 3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text>{t('Week')}</Text> <Title level={2}>{weekNumber}</Title>
            </Box>
          </Col>
          {!screen.xs && (
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
                  <Text>{clinicData?.name}</Text>
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
          )}
          <Col h="center" cw={screen.xs && 'auto'}>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              width="fit-content">
              <Text
                whiteSpace="noWrap"
                type="secondary"
                fontWeight="var(--ql-font-weight-medium)">
                {t('Patients')}:
              </Text>
              {patients?.length ? (
                <Box position="relative">
                  {patients?.length < 6 && (
                    <Tooltip title={t('Ideally in group should be 6 patients')}>
                      <Icon
                        {...exclamationIconStyles}
                        component={<ExclamationCircleOutlined />}
                      />
                    </Tooltip>
                  )}
                  <Title level={3}>{patients?.length}</Title>
                </Box>
              ) : (
                <Text>{t('Not selected')}</Text>
              )}
            </Box>
          </Col>
          {screen.xs && (
            <Col cw={12}>
              <Row noGutters>
                <Col cw={12} flexDirection="row" mb={1}>
                  <Text
                    whiteSpace="noWrap"
                    type="secondary"
                    fontWeight="var(--ql-font-weight-medium)"
                    mr={1}>
                    {t('Clinic')}:
                  </Text>
                  <Text>{clinicData?.name}</Text>
                </Col>
                <Col flexDirection="row" mb={1}>
                  <Text
                    whiteSpace="noWrap"
                    type="secondary"
                    fontWeight="var(--ql-font-weight-medium)"
                    mr={1}>
                    {t('Study')}:
                  </Text>
                  <Text>{studyData?.name || t('Not selected')}</Text>
                </Col>
                <Col flexDirection="row">
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
          )}
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
