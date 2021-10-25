import { BIOFLOW_ADMIN_SETTINGS_PATH } from '../../../constants/paths'
import { Settings } from '..'

export default [
  {
    name: 'Settings',
    path: BIOFLOW_ADMIN_SETTINGS_PATH,
    exact: false,
    component: Settings
  }
]
