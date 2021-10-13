import { BIOFLYT_ADMIN_NOTIFICATIONS_PATH } from '../../../constants/paths'
import { NotificationsAll } from '..'

export default [
  {
    name: 'NotificationsAll',
    path: BIOFLYT_ADMIN_NOTIFICATIONS_PATH,
    exact: true,
    component: NotificationsAll
  }
]
