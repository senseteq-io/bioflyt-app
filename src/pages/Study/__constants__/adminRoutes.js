import {
  BIOFLOW_ADMIN_STUDIES_PATH,
  BIOFLOW_ADMIN_STUDY_CREATE_PATH
} from '../../../constants/paths'
import { StudiesAll, StudyCreate } from '..'

export default [
  {
    name: 'StudiesAll',
    path: BIOFLOW_ADMIN_STUDIES_PATH,
    exact: true,
    component: StudiesAll
  },
  {
    name: 'StudyCreate',
    path: BIOFLOW_ADMIN_STUDY_CREATE_PATH,
    exact: true,
    component: StudyCreate
  }
]
