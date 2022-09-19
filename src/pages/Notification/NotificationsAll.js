import { NotificationsList } from 'bioflow/domains/Notification/components'
import { PageWrapper } from '@qonsoll/react-design'
import React from 'react'
import { StyledTitle } from 'app/components'
import { useTranslations } from '@qonsoll/translation'

function NotificationsAll(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  return (
    <PageWrapper
      headingProps={{
        title: <StyledTitle content={t('Notifications')} />,
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
