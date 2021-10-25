import React, { Fragment } from 'react'
import { Box } from '@qonsoll/react-design'
import { Remove, Title, Button } from '@qonsoll/react-design'
import { MailOutlined } from '@ant-design/icons'
import { Tooltip, Spin } from 'antd'
import { withTheme } from 'styled-components'
import { useTranslations } from 'app/contexts'
import { DeleteUserHelper } from 'helpers'
import { useUI } from 'app/domains/UI/contexts'
import firebase from 'firebase'
import { USERS_MODEL_NAME } from 'app/constants/models'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { notification } from 'antd'
import { SUPER_ADMIN_USER_ROLE } from 'app/constants/userRoles'
import {
  useNotification,
  usePushNotification
} from 'app/domains/Notification/hooks'
import { FOI_ADMIN_APP } from 'app/constants/applications'
import { useUserContext } from 'app/domains/User/contexts'
import { UserCard } from 'app/domains/User/components'

function TherapistInviteView(props) {
  const {
    receiverName,
    receiverEmail,
    initializedUserId,
    avatarUrl,
    onRemove,
    _id
  } = props

  // [ADDITIONAL HOOKS]
  const [{ userIdToDeletionRequestProcessing }, UIDispatch] = useUI()
  const { t } = useTranslations()
  const { createNotification } = useNotification()
  const { createPushNotification } = usePushNotification()
  const user = useUserContext()

  const [admins = []] = useCollectionData(
    firebase
      .firestore()
      .collection(USERS_MODEL_NAME)
      .where('role', '==', SUPER_ADMIN_USER_ROLE)
  )

  // [COMPUTED PROPERTIES]
  const isSpinningActive = userIdToDeletionRequestProcessing[initializedUserId]
  const userDisplayName =
    user?.firstName && user?.lastName && `${user?.firstName} ${user?.lastName}`

  // [HELPER FUNCTIONS]
  const handleRemove = async () => {
    const requestDetails = {
      uid: initializedUserId,
      email: receiverEmail,
      token: null // TODO!
    }
    const toastConfiguration = {
      success: {
        message: t('Success'),
        description: t('User was completely deleted from the system'),
        placement: 'topRight'
      },
      error: {
        message: t('Error'),
        description: t('Server responded with 404, cannot complete operation'),
        placement: 'topRight'
      }
    }

    // starting the spiner beefore request
    UIDispatch({
      type: 'UPDATE_DATA',
      data: {
        userIdToDeletionRequestProcessing: {
          ...userIdToDeletionRequestProcessing,
          [initializedUserId]: true
        }
      }
    })

    DeleteUserHelper(requestDetails, toastConfiguration).then(
      (responseData) => {
        console.log('===>>', responseData)
        // stopping the spinner after response get-back
        UIDispatch({
          type: 'UPDATE_DATA',
          data: {
            userIdToDeletionRequestProcessing: {
              ...userIdToDeletionRequestProcessing,
              [initializedUserId]: false
            }
          }
        })

        if (responseData && responseData.statusCode === 200) {
          // calling of parent component callback
          onRemove && onRemove()
        }
      }
    )

    createNotification({
      data: {
        receivers: ['ADMIN'],
        receiverId: null,
        seen: false,
        type: 'INVITATIONS',
        text: {
          EN: `${userDisplayName} removed bioflow therapist, ${receiverName}, ${receiverEmail}`,
          NO: `${userDisplayName} fjernet bioflyt behandlere, ${receiverName}, ${receiverEmail}`
        },
        additionalData: {
          therapistUserId: _id || null,
          therapistAvatarUrl: avatarUrl || null,
          therapistEmail: receiverEmail || null,
          therapistDisplayName: receiverName || null,
          patientUserId: null,
          patientAvatarUrl: null,
          patientEmail: null,
          patientUnionRepresentativeEmail: null,
          patientDisplayName: null,
          assignedTherapistId: null,
          assignedTherapistAvatarUrl: null,
          assignedTherapistEmail: null,
          assignedTherapistDisplayName: null
        }
      }
    })

    let adminsId = (admins?.length && admins.map((item) => item?._id)) || []

    if (adminsId?.length)
      createPushNotification({
        application: FOI_ADMIN_APP,
        contents: {
          en: `${userDisplayName} removed bioflow therapist, ${receiverName}, ${receiverEmail}`,
          no: `${userDisplayName} fjernet bioflyt behandlere, ${receiverName}, ${receiverEmail}`
        },
        userIds: adminsId
      })
    notification.success({
      message: t('Success'),
      description: t('Bioflow therapist was successfully removed')
    })
  }

  return (
    <Spin size="large" spinning={Boolean(isSpinningActive)}>
      <UserCard
        actions={
          <Fragment>
            <Box mb={2}>
              <Tooltip title={receiverEmail}>
                <Button
                  variant="white"
                  icon={<MailOutlined />}
                  href={`mailto:${receiverEmail}`}
                />
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title={t('Remove invitation record')}>
                <Remove
                  popconfirmPlacement="bottomRight"
                  type="primary"
                  onSubmit={handleRemove}
                  icon
                  confirmLabel={t('Yes, remove')}
                  cancelLabel={t('No, keep')}
                  itemName={receiverName}
                />
              </Tooltip>
            </Box>
          </Fragment>
        }>
        <Title
          level={4}
          color="white"
          textShadow="var(--ql-color-black) 1px 0 10px">
          {receiverName}
        </Title>
      </UserCard>
    </Spin>
  )
}

TherapistInviteView.propTypes = {}

export default withTheme(TherapistInviteView)
