import {
  BIOFLOW_ADMIN_THERAPISTS_PATH,
  BIOFLOW_ADMIN_THERAPIST_INVITE_PATH
} from '../../../constants/paths'
import { TherapistsAll, TherapistInvite } from '..'

export default [
  {
    name: 'TherapistsAll',
    path: BIOFLOW_ADMIN_THERAPISTS_PATH,
    exact: true,
    component: TherapistsAll
  },
  {
    name: 'TherapistInvite',
    path: BIOFLOW_ADMIN_THERAPIST_INVITE_PATH,
    exact: true,
    component: TherapistInvite
  }
]
