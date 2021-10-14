import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  BIOFLOW_ADMIN_CLINICS_PATH,
  BIOFLOW_ADMIN_THERAPISTS_PATH,
  BIOFLOW_ADMIN_NOTIFICATIONS_PATH,
  BIOFLOW_ADMIN_SETTINGS_PATH
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
        defaultActiveKey={BIOFLOW_ADMIN_CLINICS_PATH}
        onChange={onChange}>
        <Tabs.TabPane tab={t('Clinics')} key={BIOFLOW_ADMIN_CLINICS_PATH} />
        <Tabs.TabPane
          tab={t('Therapists')}
          key={BIOFLOW_ADMIN_THERAPISTS_PATH}
        />
        <Tabs.TabPane
          tab={t('Notifications')}
          key={BIOFLOW_ADMIN_NOTIFICATIONS_PATH}
        />
      </Tabs>
      {routes.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}

      {location.pathname === BIOFLOW_ADMIN_SETTINGS_PATH && (
        <Redirect to={BIOFLOW_ADMIN_CLINICS_PATH} />
      )}
    </PageWrapper>
  )
}

export default Settings
