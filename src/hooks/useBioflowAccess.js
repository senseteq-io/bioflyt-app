import { useUserContext } from 'app/domains/User/contexts'

/**
 *
 * @returns {{isTherapist: boolean, isAdmin: boolean}}
 */
const useBioflowAccess = () => {
  const { role, bioflowAccess } = useUserContext()

  return {
    isAdmin: bioflowAccess && role === 'ADMIN',
    isTherapist:
      bioflowAccess && ['THERAPIST', 'BIOFLOW_THERAPIST'].includes(role)
  }
}
export default useBioflowAccess
