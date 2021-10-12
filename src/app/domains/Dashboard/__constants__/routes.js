import { Dashboard } from '../routes'
import { BIOFLYT_PATH } from '../../../constants/paths'

export default [
  {
    name: 'Dashboard',
    path: BIOFLYT_PATH,
    exact: true,
    component: Dashboard
  }
]
