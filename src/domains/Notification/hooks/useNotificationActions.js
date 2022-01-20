import { generatePath, useHistory } from 'react-router-dom'
import firebase from 'firebase'
import moment from 'moment'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import { useBioflowAccess } from 'bioflow/hooks'
import THERAPIST_ROLES from 'bioflow/constants/therapistRoles'
import { NOTIFICATION_TYPES } from 'bioflow/domains/Notification/constants'
import { NOTIFICATIONS_MODEL_NAME } from 'bioflow/constants/collections'
import {
  BIOFLOW_ADMIN_GROUP_SHOW_PATH,
  BIOFLOW_GROUP_SHOW_PATH
} from 'bioflow/constants/paths'

/**
 *
 * @returns {{onMarkAsSeen: function, onDecline: function, onApprove: function}}
 * @constructor
 */
const UseNotificationActions = (notificationData = {}) => {
  const { _id, _createdAt, groupId, text, type, receivers } = notificationData
  const history = useHistory()
  const { update } = useSaveData()
  const { isTherapist } = useBioflowAccess()

  const { _id: therapistId } = useUserContext()

  const onMarkAsSeen = (args) => {
    if (args?._id || _id) {
      const therapists = args?.receivers || receivers

      update({
        collection: NOTIFICATIONS_MODEL_NAME,
        id: args?._id || _id,
        data: { receivers: { ...therapists, [therapistId]: true } }
      })
    }
  }

  const onDecline = (args) => {
    //check if notification was created at ~9:00
    //we should send notification for admin and leader,
    //in another time only leader recieve with negative answer
    const isAdminShouldRecieveNotification =
      moment(_createdAt?.toDate?.()).format('H') === '9'

    const personsThatRecieveNotifications = isAdminShouldRecieveNotification
      ? [THERAPIST_ROLES.GROUP_LEADER]
      : [THERAPIST_ROLES.GROUP_LEADER]

    firebase.functions().httpsCallable('adminAndDeputyNotify')({
      text: {
        EN: `${args?.text?.EN || text.EN} - deputy leader answered no`,
        NO: `${args?.text?.NO || text.NO} - nestleder svarte nei`
      },
      groupId: args?.groupId || groupId,
      roles: personsThatRecieveNotifications,
      answer: 'no'
    })
    onMarkAsSeen()
  }

  const onApprove = (args) => {
    firebase.functions().httpsCallable('adminAndDeputyNotify')({
      text: {
        EN: `${args?.text?.EN || text.EN} - deputy leader answered yes`,
        NO: `${args?.text?.NO || text.NO} - nestleder svarte ja`
      },
      groupId: args?.groupId || groupId,
      roles: [THERAPIST_ROLES.GROUP_LEADER],
      answer: 'yes'
    })
    onMarkAsSeen()

    if (type === NOTIFICATION_TYPES.DID_YOU_REMEMBER) {
      history.push(
        generatePath(
          isTherapist ? BIOFLOW_GROUP_SHOW_PATH : BIOFLOW_ADMIN_GROUP_SHOW_PATH,
          { id: args?.groupId || groupId }
        )
      )
    }
  }
  return { onMarkAsSeen, onDecline, onApprove }
}

export default UseNotificationActions
