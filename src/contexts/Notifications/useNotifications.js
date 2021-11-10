import { useContext } from 'react'
import ServiceContext from './NotificationsContext'

/**
 * @returns {object}
 */
const useNotifications = () => useContext(ServiceContext)

export default useNotifications
