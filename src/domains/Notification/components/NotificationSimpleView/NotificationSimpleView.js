import { useNotificationActions } from 'bioflow/domains/Notification/hooks'
import React, { useMemo } from 'react'
import firebase from 'firebase'
import { useTranslations } from '@qonsoll/translation'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import {
  Badge,
  Button,
  Col,
  Container,
  Divider,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
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

  return (
    <Container>
      <Row
        noGutters
        v="center"
        minHeight="var(--btn-height-base)"
        flexWrap="nowrap"
        style={{ cursor: 'pointer' }}
        onClick={onMarkAsSeen}>
        {isTherapist && (
          <Col cw="auto" mr={3}>
            <Badge status={!isSeen ? 'processing' : 'default'} />
          </Col>
        )}
        <Col>
          <Row noGutters v="center">
            <Col cw={[12, 12, 3, 3, 2]} mr={3}>
              <Title variant="h5" whiteSpace="wrap">
                {groupName}
              </Title>
            </Col>
            <Col cw={[12, 12, 8, 6, 7]}>
              <Text whiteSpace="wrap">{notificationText}</Text>
            </Col>
            {withConfirm && isTherapist && (
              // && !isSeen
              <Col mt={[3, 3, 0, 0, 0]}>
                <Row flexWrap="nowrap" h="right" noGutters>
                  <Col cw="auto" mr={3}>
                    <Button
                      size="middle"
                      type="text"
                      onClick={onDecline}
                      danger>
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
        </Col>
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
