import {
  BIOFLYT_ADMIN_GROUPS_PATH,
  BIOFLYT_ADMIN_GROUP_ACTIVITIES_PATH,
  BIOFLYT_ADMIN_GROUP_CREATE_PATH,
  BIOFLYT_ADMIN_GROUP_EDIT_PATH,
  BIOFLYT_ADMIN_GROUP_SHOW_PATH
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
    path: BIOFLYT_ADMIN_GROUPS_PATH,
    exact: true,
    component: GroupsAll
  },
  {
    name: 'GroupCreate',
    path: BIOFLYT_ADMIN_GROUP_CREATE_PATH,
    exact: true,
    component: GroupCreate
  },
  {
    name: 'GroupEdit',
    path: BIOFLYT_ADMIN_GROUP_EDIT_PATH,
    exact: true,
    component: GroupEdit
  },
  {
    name: 'GroupShow',
    path: BIOFLYT_ADMIN_GROUP_SHOW_PATH,
    exact: true,
    component: GroupShow
  },
  {
    name: 'GroupActivitiesAll',
    path: BIOFLYT_ADMIN_GROUP_ACTIVITIES_PATH,
    exact: true,
    component: GroupActivitiesAll
  }
]
