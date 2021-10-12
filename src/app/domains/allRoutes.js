import { default as ActivityRoutes } from './Activity/__constants__/routes'
import { default as ClinicRoutes } from './Clinic/__constants__/routes'
import { default as DashboardRoutes } from './Dashboard/__constants__/routes'
import { default as GroupRoutes } from './Group/__constants__/routes'
import { default as NotificationRoutes } from './Notification/__constants__/routes'
import { default as PatientRoutes } from './Patient/__constants__/routes'
import { default as StudyRoutes } from './Study/__constants__/routes'
import { default as TherapistRoutes } from './Therapist/__constants__/routes'

export default [
  ...ActivityRoutes,
  ...ClinicRoutes,
  ...DashboardRoutes,
  ...GroupRoutes,
  ...NotificationRoutes,
  ...PatientRoutes,
  ...StudyRoutes,
  ...TherapistRoutes
]
