import React, { useMemo } from 'react'
import { ListWithCreate } from 'app/components'
import { NotificationSimpleView } from '..'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { NOTIFICATIONS_MODEL_NAME } from 'bioflow/constants/collections'
import { useUserContext } from 'app/domains/User/contexts'
import { useBioflowAccess } from 'bioflow/hooks'
import moment from 'moment'
import firebase from 'firebase'

function NotificationsList(props) {
  // [ADDITIONAL HOOKS]
  const { _id: therapistId } = useUserContext()
  const { isAdmin } = useBioflowAccess()
  const notificationsCollectionRef = firebase
    .firestore()
    .collection(NOTIFICATIONS_MODEL_NAME)

  const [notifications] = useCollectionData(
    isAdmin
      ? notificationsCollectionRef
      : notificationsCollectionRef.where(`receivers.${therapistId}`, '!=', '')
  )

  // [COMPUTED PROPERTIES]
  const sortedNotificationsList = useMemo(() => {
    return notifications
      ? notifications.sort((a, b) =>
          moment
            .unix(b?._createdAt?.seconds)
            .diff(moment.unix(a?._createdAt?.seconds))
        )
      : []
  }, [notifications])

  // [CLEAN FUNCTIONS]

  return (
    <ListWithCreate
      grid={{ gutter: [32, 0], xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
      dataSource={sortedNotificationsList}
      withCreate={false}>
      <NotificationSimpleView />
    </ListWithCreate>
  )
}

NotificationsList.propTypes = {}

export default NotificationsList
