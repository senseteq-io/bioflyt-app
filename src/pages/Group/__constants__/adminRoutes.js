import {
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH,
  BIOFLOW_ADMIN_GROUP_CREATE_PATH,
  BIOFLOW_ADMIN_GROUP_EDIT_PATH,
  BIOFLOW_ADMIN_GROUP_SHOW_PATH
} from '../../../constants/paths'
import {
  GroupsAll,
  GroupCreate,
  GroupEdit,
  GroupShow,
  GroupActivitiesAll
} from '..'

export default [
  {
    name: 'GroupsAll',
    path: BIOFLOW_ADMIN_GROUPS_PATH,
    exact: true,
    component: (props) => <GroupsAll inTab {...props} />,
    inDashboardRoute: true
  },
  {
    name: 'GroupCreate',
    path: BIOFLOW_ADMIN_GROUP_CREATE_PATH,
    exact: true,
    component: GroupCreate,
    inDashboardRoute: false
  },
  {
    name: 'GroupEdit',
    path: BIOFLOW_ADMIN_GROUP_EDIT_PATH,
    exact: true,
    component: GroupEdit
  },
  {
    name: 'GroupShow',
    path: BIOFLOW_ADMIN_GROUP_SHOW_PATH,
    exact: true,
    component: GroupShow
  },
  {
    name: 'GroupActivitiesAll',
    path: BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH,
    exact: true,
    component: GroupActivitiesAll
  }
]
