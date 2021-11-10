import { Button, Col, Row } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { notification } from 'antd'
import { useUserContext } from 'app/domains/User/contexts'
import { NOTIFICATIONS_MODEL_NAME } from 'bioflow/constants/collections'
import { BIOFLOW_GROUP_SHOW_PATH } from 'bioflow/constants/paths'
import { NOTIFICATION_TYPES } from 'bioflow/domains/Notification/constants'
import { useNotificationActions } from 'bioflow/domains/Notification/hooks'
import { useBioflowAccess } from 'bioflow/hooks'
import firebase from 'firebase'
import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { generatePath, useHistory } from 'react-router-dom'
import NotificationsContext from './NotificationsContext'

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}

const NotificationsProvider = (props) => {
  // [ADDITIONAL_HOOKS]
  const { _id } = useUserContext()
  const history = useHistory()
  const { t } = useTranslations()
  const { onDecline, onApprove } = useNotificationActions()
  const { isTherapist, isAdmin } = useBioflowAccess()
  const { language } = useTranslations()

  const notificationsCollectionRef = firebase
    .firestore()
    .collection(NOTIFICATIONS_MODEL_NAME)

  // [DATA_FETCH]
  //Get notifications for therapist if his id in receivers field
  //or just get all notifications for super admin
  const [notifications] = useCollectionData(
    isAdmin
      ? notificationsCollectionRef
      : notificationsCollectionRef.where(`receivers.${_id}`, '!=', '')
  )
  const prevNotifications = usePrevious(notifications)

  const currentLanguage = _.toUpper(language)

  useEffect(() => {
    if (isTherapist) {
      const diff =
        prevNotifications &&
        _.differenceBy(notifications, prevNotifications, '_id')

      diff?.forEach((data) => {
        const { _id, text, groupId, type } = data
        const notificationConfig = { key: _id, message: text[currentLanguage] }

        if (type === NOTIFICATION_TYPES.INVITE) {
          notificationConfig.btn = (
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  generatePath(BIOFLOW_GROUP_SHOW_PATH, {
                    id: groupId
                  })
                )
                notification.close(_id)
              }}>
              Go to Group
            </Button>
          )
        } else {
          notificationConfig.btn = (
            <Row h="right" noGutters>
              <Col cw="auto" mr={3}>
                <Button
                  size="middle"
                  type="text"
                  onClick={() => {
                    onDecline(data)
                  }}
                  danger>
                  {t(`No`)}
                </Button>
              </Col>
              <Col cw="auto">
                <Button
                  size="middle"
                  type="primary"
                  onClick={() => {
                    onApprove(data)
                  }}>
                  {t('yes')}
                </Button>
              </Col>
            </Row>
          )
        }
        notification.info(notificationConfig)
      })
    }
  }, [notifications, prevNotifications])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount: notifications?.reduce(
          (prev, { receivers }) => (!receivers[_id] ? prev + 1 : prev),
          0
        )
      }}
      {...props}
    />
  )
}

export default NotificationsProvider
