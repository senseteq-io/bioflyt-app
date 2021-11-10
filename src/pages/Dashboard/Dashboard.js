import React, { useMemo, useState } from 'react'
import { Button, PageWrapper } from '@qonsoll/react-design'
import { Tabs } from 'antd'
import {
  Route,
  useHistory,
  useLocation,
  Redirect,
  matchPath
} from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { AdminGroupRoutes } from '../Group'
import { AdminActivityRoutes } from '../Activity'
import { AdminSettingRoutes } from '../Settings'
import { AdminStudyRoutes } from '../Study'
import { AdminTherapistsRoutes } from '../Therapist'
import {
  BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH,
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_SETTINGS_PATH,
  BIOFLOW_ADMIN_PATH
} from 'bioflow/constants/paths'
import { FilterOutlined } from '@ant-design/icons'
import { GroupsAll } from 'bioflow/pages/Group'

const routesWithTabs = [
  ...AdminGroupRoutes.filter(({ name }) => name === 'GroupsAll'),
  ...AdminActivityRoutes,
  ...AdminSettingRoutes
]
const routesWithoutTabs = [
  ...AdminGroupRoutes.filter(({ name }) => name !== 'GroupsAll'),
  ...AdminStudyRoutes.filter(({ name }) => name !== 'StudiesAll'),
  ...AdminTherapistsRoutes.filter(({ name }) => name !== 'TherapistsAll')
]

function Dashboard() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslations()

  //[COMPONENT STATE HOOKS]
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false)

  // [COMPUTED PROPERTIES]
  const activeRoute = useMemo(
    () =>
      routesWithTabs.filter((route) =>
        matchPath(location.pathname, route.path)
      )?.[0]?.path,
    [location.pathname]
  )
  const isWithTabsRoute = useMemo(
    () =>
      !routesWithoutTabs.filter((route) =>
        matchPath(location.pathname, route.path)
      )?.length,
    [location.pathname]
  )

  const computedRedirectRule = useMemo(
    () => location.pathname === BIOFLOW_ADMIN_PATH,
    [location.pathname]
  )

  // [CLEAN FUNCTIONS]
  const onChange = (key) => {
    history.push(key)
  }

  const onOpenFilterDrawer = () => {
    setIsFilterDrawerVisible(true)
  }

  return isWithTabsRoute ? (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Bioflow'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: '0px'
      }}
      action={
        <Button
          icon={<FilterOutlined />}
          type="primary"
          onClick={onOpenFilterDrawer}>
          {t('Filter')}
        </Button>
      }
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

      {routesWithTabs.map(({ path, exact, component }) => {
        if (path === BIOFLOW_ADMIN_GROUPS_PATH) {
          return (
            <Route key={path} path={path} exact={exact}>
              <GroupsAll
                inTab
                isDrawerVisible={isFilterDrawerVisible}
                setIsDrawerVisible={setIsFilterDrawerVisible}
                onOpenFilterDrawer={onOpenFilterDrawer}
              />
            </Route>
          )
        } else {
          return (
            <Route key={path} path={path} exact={exact} component={component} />
          )
        }
      })}

      {computedRedirectRule && <Redirect to={BIOFLOW_ADMIN_GROUPS_PATH} />}
    </PageWrapper>
  ) : (
    <>
      {routesWithoutTabs.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}
    </>
  )
}

export default Dashboard
