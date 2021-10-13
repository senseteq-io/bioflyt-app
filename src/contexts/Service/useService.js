import { useContext } from 'react'
import ServiceContext from './ServiceContext'

/**
 * @returns {object}
 */
const useService = () => useContext(ServiceContext)

export default useService
