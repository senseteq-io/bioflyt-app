import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper } from '@qonsoll/react-design'
import { NotificationsList } from 'bioflow/domains/Notification/components'

function NotificationsAll(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  return (
    <PageWrapper
      headingProps={{
        title: t('Notifications'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <NotificationsList />
    </PageWrapper>
  )
}

NotificationsAll.propTypes = {}

export default NotificationsAll
