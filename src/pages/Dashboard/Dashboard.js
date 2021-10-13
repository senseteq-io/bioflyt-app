import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  BIOFLYT_ADMIN_GLOBAL_ACTIVITIES_PATH,
  BIOFLYT_ADMIN_GROUPS_PATH,
  BIOFLYT_ADMIN_SETTINGS_PATH,
  BIOFLYT_ADMIN_PATH
} from 'modules/bioflyt-app/src/constants/paths'
import {
  Route,
  useHistory,
  useLocation,
  Redirect,
  matchPath
} from 'react-router-dom'
import { useTranslations } from '../../contexts/Translation'
import { AdminGroupRoutes } from '../../pages/Group'
import { AdminActivityRoutes } from '../../pages/Activity'
import { AdminSettingRoutes } from '../../pages/Settings'

function Dashboard() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()
  const t = useTranslations()
  // [COMPUTED PROPERTIES]
  const routes = [
    ...AdminGroupRoutes,
    ...AdminActivityRoutes,
    ...AdminSettingRoutes
  ]

  const activeRoute = routes.filter((route) =>
    matchPath(location.pathname, route.path)
  )?.[0]?.route

  // [CLEAN FUNCTIONS]
  function onChange(key) {
    history.push(key)
  }

  return (
    <PageWrapper firstLevelHidden isBottomSticky>
      <Tabs
        size="large"
        activeKey={activeRoute}
        defaultActiveKey={BIOFLYT_ADMIN_GROUPS_PATH}
        onChange={onChange}>
        <Tabs.TabPane tab={t('Groups')} key={BIOFLYT_ADMIN_GROUPS_PATH} />
        <Tabs.TabPane
          tab={t('Activities')}
          key={BIOFLYT_ADMIN_GLOBAL_ACTIVITIES_PATH}
        />
        <Tabs.TabPane tab={t('Settings')} key={BIOFLYT_ADMIN_SETTINGS_PATH} />
      </Tabs>
      {routes.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}

      {location.pathname === BIOFLYT_ADMIN_PATH && (
        <Redirect to={BIOFLYT_ADMIN_GROUPS_PATH} />
      )}
    </PageWrapper>
  )
}

export default Dashboard
