import { useNotificationActions } from 'bioflow/domains/Notification/hooks'
import React, { useMemo } from 'react'
import firebase from 'firebase'
import { useTranslations } from '@qonsoll/translation'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Tooltip } from 'antd'
import {
  Button,
  Col,
  Container,
  Divider,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
import { EyeOutlined } from '@ant-design/icons'
import { useBioflowAccess } from 'bioflow/hooks'
import { useUserContext } from 'app/domains/User/contexts'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'

function NotificationSimpleView(props) {
  const { groupId, text, withConfirm, receivers, answer } = props

  // [ADDITIONAL HOOKS]
  const { t, language } = useTranslations()
  const { isTherapist } = useBioflowAccess()
  const { _id: therapistId } = useUserContext()
  const { onMarkAsSeen, onApprove, onDecline } = useNotificationActions(props)
  const [groupData] = useDocumentData(
    firebase.firestore().collection(GROUPS_MODEL_NAME).doc(groupId)
  )

  // [COMPUTED PROPERTIES]
  const groupName = useMemo(
    () =>
      groupData?.weekNumber
        ? `${t('Group')}: ${t('Week')} ${groupData?.weekNumber}`
        : t('Group was deleted'),
    [groupData]
  )
  const notificationText = useMemo(() => text[language.toUpperCase()], [
    text,
    language
  ])

  const isSeen = useMemo(() => receivers?.[therapistId] || answer, [
    receivers,
    answer
  ])

  // [CLEAN FUNCTIONS]

  return (
    <Container>
      <Row v="center" height="var(--btn-height-base)" noGutters>
        {isTherapist && (
          <Col cw="auto" mr={3}>
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={onMarkAsSeen}
              disabled={isSeen}
            />
          </Col>
        )}
        <Col>
          <Tooltip title={groupName}>
            <Title variant="h5" isEllipsis>
              {groupName}
            </Title>
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title={notificationText}>
            <Text isEllipsis>{notificationText}</Text>
          </Tooltip>
        </Col>
        {withConfirm && isTherapist && (
          <Col cw="auto">
            <Row h="right" noGutters>
              <Col cw="auto" mr={3}>
                <Button size="middle" type="text" onClick={onDecline} danger>
                  {t(`No`)}
                </Button>
              </Col>
              <Col cw="auto">
                <Button size="middle" type="primary" onClick={onApprove}>
                  {t('yes')}
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
      <Row noGutters>
        <Col>
          <Divider mt={2} mb={0} />
        </Col>
      </Row>
    </Container>
  )
}

NotificationSimpleView.propTypes = {}

export default NotificationSimpleView
