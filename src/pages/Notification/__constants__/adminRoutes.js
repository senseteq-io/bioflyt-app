import { BIOFLOW_ADMIN_NOTIFICATIONS_PATH } from '../../../constants/paths'
import { NotificationsAll } from '..'

export default [
  {
    name: 'NotificationsAll',
    path: BIOFLOW_ADMIN_NOTIFICATIONS_PATH,
    exact: true,
    component: NotificationsAll
  }
]
