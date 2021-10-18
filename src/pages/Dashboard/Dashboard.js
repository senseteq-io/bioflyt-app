import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  Route,
  useHistory,
  useLocation,
  Redirect,
  matchPath
} from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { AdminGroupRoutes } from '../../pages/Group'
import { AdminActivityRoutes } from '../../pages/Activity'
import { AdminSettingRoutes } from '../../pages/Settings'
import {
  BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH,
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_SETTINGS_PATH,
  BIOFLOW_ADMIN_PATH
} from '../../constants/paths'

function Dashboard() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslations()
  // [COMPUTED PROPERTIES]
  const routesWithTabs = [
    ...AdminGroupRoutes.filter(({ name }) => name === 'GroupsAll'),
    ...AdminActivityRoutes,
    ...AdminSettingRoutes
  ]

  const routesWithoutTabs = AdminGroupRoutes.filter(
    ({ name }) => name !== 'GroupsAll'
  )

  const activeRoute = routesWithTabs.filter((route) =>
    matchPath(location.pathname, route.path)
  )?.[0]?.route

  // [CLEAN FUNCTIONS]
  function onChange(key) {
    history.push(key)
  }

  return (
    <>
      <PageWrapper
        onBack={() => history.goBack()}
        headingProps={{
          title: t('Bioflow'),
          titleSize: 2,
          textAlign: 'left',
          marginBottom: '0px'
        }}
        isBottomSticky>
        <Tabs
          size="large"
          activeKey={activeRoute}
          defaultActiveKey={BIOFLOW_ADMIN_GROUPS_PATH}
          onChange={onChange}>
          <Tabs.TabPane tab={t('Groups')} key={BIOFLOW_ADMIN_GROUPS_PATH} />
          <Tabs.TabPane
            tab={t('Activities')}
            key={BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH}
          />
          <Tabs.TabPane tab={t('Settings')} key={BIOFLOW_ADMIN_SETTINGS_PATH} />
        </Tabs>
        {routesWithTabs.map(({ path, exact, component }) => (
          <Route key={path} path={path} exact={exact} component={component} />
        ))}

        {location.pathname === BIOFLOW_ADMIN_PATH && (
          <Redirect to={BIOFLOW_ADMIN_GROUPS_PATH} />
        )}
      </PageWrapper>
      {routesWithoutTabs.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}
    </>
  )
}

export default Dashboard
