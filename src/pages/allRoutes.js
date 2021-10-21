import { AdminDashboardRoutes, TherapistDashboardRoutes } from './Dashboard'
import { AdminActivityRoutes } from './Activity'
import { AdminGroupRoutes, TherapistGroupRoutes } from './Group'
import { AdminSettingRoutes } from './Settings'
import { AdminClinicRoutes } from './Clinic'
import { AdminStudyRoutes } from './Study'
import { AdminTherapistsRoutes } from './Therapist'
import { TherapistPatientsRoutes } from './Patient'
import { TherapistNotificationRoutes } from './Notification'

export const allAdminRoutes = [
  ...AdminDashboardRoutes,
  ...AdminActivityRoutes,
  ...AdminGroupRoutes,
  ...AdminSettingRoutes,
  ...AdminClinicRoutes,
  ...AdminStudyRoutes,
  ...AdminTherapistsRoutes
]

export const allTherapistRoutes = [
  ...TherapistDashboardRoutes,
  ...TherapistGroupRoutes,
  ...TherapistNotificationRoutes,
  ...TherapistPatientsRoutes
]

export default [
  ...AdminDashboardRoutes,
  ...AdminActivityRoutes,
  ...AdminGroupRoutes,
  ...AdminSettingRoutes,
  ...AdminClinicRoutes,
  ...AdminStudyRoutes,
  ...AdminTherapistsRoutes,
  ...TherapistGroupRoutes,
  ...TherapistNotificationRoutes
]
