import { BIOFLOW_PATIENTS_PATH } from '../../../constants/paths'
import { PatientsAll } from '..'

export default [
  {
    name: 'PatientsAll',
    path: BIOFLOW_PATIENTS_PATH,
    exact: true,
    component: PatientsAll
  }
]
