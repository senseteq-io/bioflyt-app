import React, { useMemo } from 'react'
import {
  Button,
  Col,
  Container,
  Divider,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
import { Tooltip } from 'antd'
import { useTranslations } from '@qonsoll/translation'
import { useBioflowAccess } from 'bioflow/hooks'
import { EyeOutlined } from '@ant-design/icons'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import {
  GROUPS_MODEL_NAME,
  NOTIFICATIONS_MODEL_NAME
} from 'bioflow/constants/collections'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'

function NotificationSimpleView(props) {
  const { _id, groupId, text, withConfirm, receivers, answer } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { isTherapist } = useBioflowAccess()
  const { _id: therapistId } = useUserContext()
  const { update } = useSaveData()

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

  const isSeen = useMemo(() => receivers?.[therapistId] || answer, [
    receivers,
    answer
  ])

  // [CLEAN FUNCTIONS]
  const onMarkAsSeen = () => {
    _id &&
      update({
        collection: NOTIFICATIONS_MODEL_NAME,
        id: _id,
        data: { receivers: { [therapistId]: true } }
      })
  }

  const onDeny = () => {}

  const onConfirm = () => {}

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
        <Col cw="auto" mr={4}>
          <Tooltip title={groupName}>
            <Title variant="h5" isEllipsis>
              {groupName}
            </Title>
          </Tooltip>
        </Col>
        <Col cw="auto">
          <Tooltip title={text}>
            <Text isEllipsis>{text}</Text>
          </Tooltip>
        </Col>
        {withConfirm && isTherapist && (
          <Col>
            <Row h="right" noGutters>
              <Col cw="auto" mr={3}>
                <Button size="middle" type="text" onClick={onDeny} danger>
                  {t(`No`)}
                </Button>
              </Col>
              <Col cw="auto">
                <Button size="middle" type="primary" onClick={onConfirm}>
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
