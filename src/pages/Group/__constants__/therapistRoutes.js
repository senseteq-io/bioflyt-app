import {
  BIOFLOW_GROUPS_PATH,
  BIOFLOW_GROUP_ACTIVITIES_PATH,
  BIOFLOW_GROUP_CREATE_PATH,
  BIOFLOW_GROUP_EDIT_PATH,
  BIOFLOW_GROUP_SHOW_PATH
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
    path: BIOFLOW_GROUPS_PATH,
    exact: true,
    component: GroupsAll
  },
  {
    name: 'GroupCreate',
    path: BIOFLOW_GROUP_CREATE_PATH,
    exact: true,
    component: GroupCreate
  },
  {
    name: 'GroupEdit',
    path: BIOFLOW_GROUP_EDIT_PATH,
    exact: true,
    component: GroupEdit
  },
  {
    name: 'GroupShow',
    path: BIOFLOW_GROUP_SHOW_PATH,
    exact: true,
    component: GroupShow
  },
  {
    name: 'GroupActivitiesAll',
    path: BIOFLOW_GROUP_ACTIVITIES_PATH,
    exact: true,
    component: GroupActivitiesAll
  }
]
