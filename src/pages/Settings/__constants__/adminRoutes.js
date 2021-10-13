import { BIOFLYT_ADMIN_SETTINGS_PATH } from '../../../constants/paths'
import { Settings } from '..'

export default [
  {
    name: 'Settings',
    path: BIOFLYT_ADMIN_SETTINGS_PATH,
    exact: false,
    component: Settings
  }
]
