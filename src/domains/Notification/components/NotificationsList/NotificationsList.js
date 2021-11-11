import React, { useMemo } from 'react'
import moment from 'moment'
import { useNotifications } from 'bioflow/contexts/Notifications'
import { ListWithCreate } from 'app/components'
import { NotificationSimpleView } from '..'

function NotificationsList() {
  const { notifications } = useNotifications()

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
