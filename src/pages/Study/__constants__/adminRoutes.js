import {
  BIOFLYT_ADMIN_STUDIES_PATH,
  BIOFLYT_ADMIN_STUDY_CREATE_PATH
} from '../../../constants/paths'
import { StudiesAll, StudyCreate } from '..'

export default [
  {
    name: 'StudiesAll',
    path: BIOFLYT_ADMIN_STUDIES_PATH,
    exact: true,
    component: StudiesAll
  },
  {
    name: 'StudyCreate',
    path: BIOFLYT_ADMIN_STUDY_CREATE_PATH,
    exact: true,
    component: StudyCreate
  }
]
