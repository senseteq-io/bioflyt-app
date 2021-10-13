import { AdminDashboardRoutes } from './Dashboard'
import { AdminActivityRoutes } from './Activity'
import { AdminGroupRoutes } from './Group'
import { AdminSettingRoutes } from './Settings'
import { AdminClinicRoutes } from './Clinic'
import { AdminStudyRoutes } from './Study'
import { AdminTherapistsRoutes } from './Therapist'

import { TherapistGroupRoutes } from './Group'
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
  ...TherapistGroupRoutes,
  ...TherapistNotificationRoutes
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
