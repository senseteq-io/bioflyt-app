import {
  SUPER_ADMIN_USER_ROLE,
  BIOFLOW_THERAPIST_ROLE
} from 'app/constants/userRoles'
import { useUserContext } from 'app/domains/User/contexts'

/**
 *
 * @returns {{isTherapist: boolean, isAdmin: boolean}}
 */
const useBioflowAccess = () => {
  const { role, isBioflowTherapistAdmin } = useUserContext()

  return {
    isAdmin: role === SUPER_ADMIN_USER_ROLE,
    isTherapist: role === BIOFLOW_THERAPIST_ROLE,
    isTherapistAdmin: isBioflowTherapistAdmin
  }
}
export default useBioflowAccess
