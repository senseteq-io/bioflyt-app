import { BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH } from '../../../constants/paths'
import { ActivitiesAll } from '..'

export default [
  {
    name: 'ActivitiesAll',
    path: BIOFLOW_ADMIN_GLOBAL_ACTIVITIES_PATH,
    exact: true,
    component: ActivitiesAll
  }
]
