import React, { useMemo } from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  BIOFLOW_ADMIN_CLINICS_PATH,
  BIOFLOW_ADMIN_THERAPISTS_PATH,
  BIOFLOW_ADMIN_NOTIFICATIONS_PATH,
  BIOFLOW_ADMIN_SETTINGS_PATH,
  BIOFLOW_ADMIN_STUDIES_PATH
} from 'bioflow/constants/paths'
import {
  Route,
  useHistory,
  useLocation,
  Redirect
} from 'react-router-dom'
import { matchPath } from 'react-router'
import { AdminClinicRoutes } from '../Clinic'
import { AdminTherapistsRoutes } from '../Therapist'
import { AdminNotificationRoutes } from '../Notification'
import { AdminStudyRoutes } from '../Study'
import { useTranslations } from '@qonsoll/translation'

function Settings(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslations()

  // [COMPUTED PROPERTIES]
  const routes = [
    ...AdminClinicRoutes,
    ...AdminNotificationRoutes,
    ...AdminStudyRoutes.filter(({ name }) => name === 'StudiesAll'),
    ...AdminTherapistsRoutes.filter(({ name }) => name === 'TherapistsAll')
  ]

  const activeRoute = useMemo(
    () =>
      routes.filter((route) => matchPath(location.pathname, route.path))?.[0]
        ?.path,
    [location.pathname]
  )

  // [CLEAN FUNCTIONS]
  function onChange(key) {
    history.push(key)
  }

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
        <Tabs.TabPane tab={t('Studies')} key={BIOFLOW_ADMIN_STUDIES_PATH} />
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
