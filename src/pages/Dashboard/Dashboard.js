import React, { useMemo, Fragment } from 'react'
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
import { AdminGroupRoutes, TherapistGroupRoutes } from '../Group'
import { AdminActivityRoutes } from '../Activity'
import { AdminSettingRoutes } from '../Settings'
import { AdminStudyRoutes } from '../Study'
import { AdminTherapistsRoutes } from '../Therapist'
import { TherapistPatientsRoutes } from '../Patient'
import { TherapistNotificationRoutes } from '../Notification'
import {
  BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH,
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_SETTINGS_PATH,
  BIOFLOW_ADMIN_PATH,
  BIOFLOW_PATH,
  BIOFLOW_GROUPS_PATH,
  BIOFLOW_PATIENTS_PATH,
  BIOFLOW_NOTIFICATIONS_PATH
} from 'bioflow/constants/paths'

const adminRoutesWithTabs = [
  ...AdminGroupRoutes.filter(({ name }) => name === 'GroupsAll'),
  ...AdminActivityRoutes,
  ...AdminSettingRoutes
]
const adminRoutesWithoutTabs = [
  ...AdminGroupRoutes.filter(({ name }) => name !== 'GroupsAll'),
  ...AdminStudyRoutes.filter(({ name }) => name !== 'StudiesAll'),
  ...AdminTherapistsRoutes.filter(({ name }) => name !== 'TherapistsAll')
]

const therapistRoutesWithTabs = [
  ...TherapistGroupRoutes.filter(({ name }) => name === 'GroupsAll'),
  ...TherapistPatientsRoutes,
  ...TherapistNotificationRoutes
]
const therapistRoutesWithoutTabs = TherapistGroupRoutes.filter(
  ({ name }) => name !== 'GroupsAll'
)

function Dashboard(props) {
  const { isAdmin } = props
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslations()

  // [COMPUTED PROPERTIES]
  const routesWithTabs = isAdmin ? adminRoutesWithTabs : therapistRoutesWithTabs

  const routesWithoutTabs = isAdmin
    ? adminRoutesWithoutTabs
    : therapistRoutesWithoutTabs

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

  const computedTitle = useMemo(
    () => (isAdmin ? `${t('Bioflow')}(${t('Admin')})` : t('Bioflow')),
    [isAdmin]
  )
  const computedGroupsPath = useMemo(
    () => (isAdmin ? BIOFLOW_ADMIN_GROUPS_PATH : BIOFLOW_GROUPS_PATH),
    [isAdmin]
  )
  const computedRedirectRule = useMemo(
    () => location.pathname === (isAdmin ? BIOFLOW_ADMIN_PATH : BIOFLOW_PATH),
    [isAdmin, location.pathname]
  )

  // [CLEAN FUNCTIONS]
  function onChange(key) {
    history.push(key)
  }
  const goBack = () => history.goBack()

  return isWithTabsRoute ? (
    <PageWrapper
      onBack={goBack}
      headingProps={{
        title: computedTitle,
        titleSize: 2,
        textAlign: 'left',
        marginBottom: '0px'
      }}
      isBottomSticky>
      <Tabs
        size="large"
        activeKey={activeRoute}
        defaultActiveKey={computedGroupsPath}
        onChange={onChange}>
        <Tabs.TabPane tab={t('Groups')} key={computedGroupsPath} />
        {isAdmin ? (
          <Fragment>
            <Tabs.TabPane
              tab={t('Activities')}
              key={BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH}
            />

            <Tabs.TabPane
              tab={t('Settings')}
              key={BIOFLOW_ADMIN_SETTINGS_PATH}
            />
          </Fragment>
        ) : (
          <Fragment>
            <Tabs.TabPane tab={t('Patients')} key={BIOFLOW_PATIENTS_PATH} />
            <Tabs.TabPane
              tab={t('Notifications')}
              key={BIOFLOW_NOTIFICATIONS_PATH}
            />
          </Fragment>
        )}
      </Tabs>
      {routesWithTabs.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}

      {computedRedirectRule && <Redirect to={computedGroupsPath} />}
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
