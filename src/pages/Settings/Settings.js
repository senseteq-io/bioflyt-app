import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  BIOFLYT_ADMIN_CLINICS_PATH,
  BIOFLYT_ADMIN_THERAPISTS_PATH,
  BIOFLYT_ADMIN_NOTIFICATIONS_PATH,
  BIOFLYT_ADMIN_SETTINGS_PATH
} from 'modules/bioflyt-app/src/constants/paths'
import {
  Route,
  useHistory,
  useLocation,
  Redirect,
  matchPath
} from 'react-router-dom'
import { AdminClinicRoutes } from '../../pages/Clinic'
import { AdminTherapistsRoutes } from '../../pages/Therapist'
import { AdminNotificationRoutes } from '../../pages/Notification'

function Settings(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()

  // [COMPUTED PROPERTIES]
  const routes = [
    ...AdminClinicRoutes,
    ...AdminTherapistsRoutes,
    ...AdminNotificationRoutes
  ]

  const activeRoute = routes.filter((route) =>
    matchPath(location.pathname, route.path)
  )?.[0]?.route

  // [CLEAN FUNCTIONS]
  function onChange(key) {
    history.push(key)
  }

  // TODO replace to translation function
  const t = (text) => text

  return (
    <PageWrapper firstLevelHidden isBottomSticky>
      <Tabs
        size="large"
        activeKey={activeRoute}
        defaultActiveKey={BIOFLYT_ADMIN_CLINICS_PATH}
        onChange={onChange}>
        <Tabs.TabPane tab={t('Clinics')} key={BIOFLYT_ADMIN_CLINICS_PATH} />
        <Tabs.TabPane
          tab={t('Therapists')}
          key={BIOFLYT_ADMIN_THERAPISTS_PATH}
        />
        <Tabs.TabPane
          tab={t('Notifications')}
          key={BIOFLYT_ADMIN_NOTIFICATIONS_PATH}
        />
      </Tabs>
      {routes.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}

      {location.pathname === BIOFLYT_ADMIN_SETTINGS_PATH && (
        <Redirect to={BIOFLYT_ADMIN_CLINICS_PATH} />
      )}
    </PageWrapper>
  )
}

export default Settings
