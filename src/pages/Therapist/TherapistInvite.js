import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { TherapistInviteForm } from 'bioflow/domains/Therapist/components'
import { useHistory } from 'react-router'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import { STUDIES_MODEL_NAME } from 'bioflow/constants/collections'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import {
  useNotification,
  usePushNotification
} from 'app/domains/Notification/hooks'
import { BIOFLOW_THERAPIST_INVITATION_TYPE } from 'app/constants/invitationTypes'
import {
  CLINICS_MODEL_NAME,
  INVITATIONS_MODEL_NAME,
  USERS_MODEL_NAME
} from 'app/constants/models'
import { CREATED_INVITATION_STATUS } from 'app/constants/invitationStatuses'
import { SEND_EMAIL_INVITATION_TRIGGER_ACTION } from 'app/constants/invitationTriggerActions'
import { notification } from 'antd'
import md5 from 'md5'
import { SUPER_ADMIN_USER_ROLE } from 'app/constants/userRoles'
import { FOI_ADMIN_APP } from 'app/constants/applications'
import { INVITE_THERAPIST } from 'bioflow/constants/activitiesTypes'
import { useActivities } from 'bioflow/hooks'

const EMAIL_TO_PASSWORD_RDB_COLLECTION_NAME = 'userEmailExistance'

function TherapistInvite() {
  //[ADDITIONAl HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const user = useUserContext()
  const { save } = useSaveData()
  const { createNotification } = useNotification()
  const { createPushNotification } = usePushNotification()
  const { createActivity } = useActivities()

  const RDB = firebase.database()

  const [studies] = useCollectionData(
    firebase.firestore().collection(STUDIES_MODEL_NAME)
  )
  const [clinics] = useCollectionData(
    firebase
      .firestore()
      .collection(CLINICS_MODEL_NAME)
      .where('bioflowAccess', '==', true)
  )
  const [admins = []] = useCollectionData(
    firebase
      .firestore()
      .collection(USERS_MODEL_NAME)
      .where('role', '==', SUPER_ADMIN_USER_ROLE)
  )
  //[COMPUTED_PROPERTIES]
  const currentUserDisplayName =
    user?.firstName && user?.lastName && `${user?.firstName} ${user?.lastName}`

  // [CLEAN FUNCTIONS]
  const goBack = () => history.goBack()

  const handleTherapistInviteFormSubmit = async ({
    email,
    firstName,
    lastName,
    phone,
    clinics,
    clinicId,
    studies
  }) => {
    const emailFormatted = `${email}`.toLocaleLowerCase()

    const firstNameFormatted = `${firstName}`.trim()
    const lastNameFormatted = `${lastName}`.trim()

    // handling of badly formatted fields data
    if (!emailFormatted || !firstNameFormatted || !lastNameFormatted) {
      notification.error({
        message: t('Error'),
        description: t(
          'Data that you entered is badly formatted, please check and change first name, last name and email'
        )
      })

      return null
    }

    const bioflowTherapistDisplayName = `${firstNameFormatted} ${lastNameFormatted}`

    RDB.ref(EMAIL_TO_PASSWORD_RDB_COLLECTION_NAME).once('value', (snapshot) => {
      const data = snapshot.val()

      // to check, wether user is already in the system or not
      if (data[md5(emailFormatted)]) {
        notification.error({
          message: t('Error'),
          description: t('User with such email is already in the system')
        })
      } else {
        save({
          collection: INVITATIONS_MODEL_NAME,
          data: {
            clinicId,
            phone,
            studies,
            clinics,
            invitationCreatedById: user._id,
            receiverEmail: emailFormatted,
            receiverName: bioflowTherapistDisplayName,
            receiverFirstName: firstNameFormatted,
            receiverLastName: lastNameFormatted,
            status: CREATED_INVITATION_STATUS,
            triggerActions: [SEND_EMAIL_INVITATION_TRIGGER_ACTION],
            type: BIOFLOW_THERAPIST_INVITATION_TYPE,
            initializedUserId: null
          }
        })

        createNotification({
          data: {
            receivers: ['ADMIN'],
            receiverId: null,
            seen: false,
            type: 'INVITATIONS',
            text: {
              EN: `${currentUserDisplayName} invited bioflow therapist, ${bioflowTherapistDisplayName}, ${emailFormatted}`,
              NO: `${currentUserDisplayName} inviterte bioflyt behandlere, ${bioflowTherapistDisplayName}, ${emailFormatted}`
            },
            additionalData: {
              therapistUserId: null,
              therapistAvatarUrl: null,
              therapistEmail: null,
              therapistDisplayName: null,
              patientUserId: null,
              patientAvatarUrl: null,
              patientEmail: null,
              patientUnionRepresentativeEmail: emailFormatted || null,
              patientDisplayName: null,
              assignedTherapistId: null,
              assignedTherapistAvatarUrl: null,
              assignedTherapistEmail: null,
              assignedTherapistDisplayName: null
            }
          }
        })
        
        createActivity({
          isTriggeredByAdmin: true,
          type: INVITE_THERAPIST,
          additionalData: {
            adminDisplayName: currentUserDisplayName,
            adminEmail: user?.email,
            invitedTherapistDisplayName: bioflowTherapistDisplayName,
            invitedTherapistEmail: emailFormatted
          }
        })

        let adminsId = (admins?.length && admins.map((item) => item?._id)) || []

        if (adminsId?.length)
          createPushNotification({
            application: FOI_ADMIN_APP,
            contents: {
              en: `${currentUserDisplayName} invited bioflow therapist, ${bioflowTherapistDisplayName}, ${emailFormatted}`,
              no: `${currentUserDisplayName} inviterte bioflyt terapeut, ${bioflowTherapistDisplayName}, ${emailFormatted}`
            },
            userIds: adminsId
          })

        notification.success({
          message: t('Success'),
          description: t('Bioflow therapist was successfully invited')
        })
        history.goBack()
      }
    })
  }

  return (
    <PageWrapper
      alignMiddle
      contentWidth={['100%', '80%', '70%', '50%', '40%']}
      onBack={goBack}
      headingProps={{
        title: t('Invite new therapist'),
        titleSize: 2,
        textAlign: 'center',
        marginBottom: 32
      }}>
      <TherapistInviteForm
        studies={studies}
        clinics={clinics}
        onSubmit={handleTherapistInviteFormSubmit}
      />
    </PageWrapper>
  )
}

export default TherapistInvite
