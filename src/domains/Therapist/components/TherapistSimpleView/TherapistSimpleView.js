import React, { Fragment, useState } from 'react'
import { Button, Box, Title, Remove, Popover } from '@qonsoll/react-design'
import { notification, Tooltip, Spin } from 'antd'
import { UserCard } from 'app/domains/User/components'
import { DeleteUserHelper } from 'helpers'
import { MailOutlined, TeamOutlined } from '@ant-design/icons'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { useUserContext } from 'app/domains/User/contexts'
import { useUI } from 'app/domains/UI/contexts'
import {
  useNotification,
  usePushNotification
} from 'app/domains/Notification/hooks'
import { FOI_ADMIN_APP } from 'app/constants/applications'
import { SUPER_ADMIN_USER_ROLE } from 'app/constants/userRoles'
import { USERS_MODEL_NAME } from 'app/constants/models'
import firebase from 'firebase'
import { REMOVE_THERAPIST } from 'bioflow/constants/activitiesTypes'
import { useActivities } from 'bioflow/hooks'
import { TherapistGroupsList } from '../'

function TherapistSimpleView(props) {
  const {
    firstName,
    lastName,
    email,
    clinics,
    avatarUrl,
    _id: initializedUserId
  } = props

  // [ADDITIONAL HOOKS]
  const [{ userIdToDeletionRequestProcessing }, UIDispatch] = useUI()
  const { t } = useTranslations()
  const { createActivity } = useActivities()
  const { createNotification } = useNotification()
  const { createPushNotification } = usePushNotification()
  const user = useUserContext()

  const [admins = []] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(USERS_MODEL_NAME)
      .where('role', '==', SUPER_ADMIN_USER_ROLE)
  )

  const [isGroupsListVisible, setIsGroupListVisible] = useState(false)
  const [additionalTherapistData, setAdditionalTherapistData] = useState({})
  const [groupDataLoading, setGroupDataLoading] = useState(true)

  // [COMPUTED PROPERTIES]
  const displayName = `${firstName} ${lastName}`
  const userDisplayName =
    user?.firstName && user?.lastName && `${user?.firstName} ${user?.lastName}`
  const isSpinningActive = userIdToDeletionRequestProcessing[initializedUserId]
  const isTherapistHasGroups =
    additionalTherapistData?.disordersData &&
    Object.keys?.(additionalTherapistData?.disordersData)?.length

  // [CLEAN FUNCTIONS]
  const handleRemove = async () => {
    const requestDetails = {
      uid: initializedUserId,
      email: email,
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

    DeleteUserHelper(requestDetails, toastConfiguration).then(() => {
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
    })

    createActivity({
      isTriggeredByAdmin: true,
      type: REMOVE_THERAPIST,
      additionalData: {
        adminDisplayName: `${user?.firstName} ${user?.lastName}`,
        adminEmail: user?.email,
        removedTherapistDisplayName: `${firstName} ${lastName}`,
        removedTherapistEmail: email
      }
    })

    createNotification({
      data: {
        receivers: ['ADMIN'],
        receiverId: null,
        seen: false,
        type: 'INVITATIONS',
        text: {
          EN: `${userDisplayName} removed therapist, ${displayName}, ${email}`,
          NO: `${userDisplayName} fjernet behandlere, ${displayName}, ${email}`
        },
        additionalData: {
          therapistUserId: initializedUserId || null,
          therapistAvatarUrl: avatarUrl || null,
          therapistEmail: email || null,
          therapistDisplayName: displayName || null,
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
          en: `${userDisplayName} removed bioflow therapist, ${displayName}, ${email}`,
          no: `${userDisplayName} fjernet bioflyt behandlere, ${displayName}, ${email}`
        },
        userIds: adminsId
      })
    notification.success({
      message: t('Success'),
      description: t('Bioflow therapist was successfully removed')
    })
  }

  const handlePopoverVisible = (visible) => {
    setIsGroupListVisible(visible)
  }

  const actions = (
    <Fragment>
      <Box mb={2}>
        <Tooltip title={t('Therapist groups')}>
          <Popover
            content={
              <TherapistGroupsList
                initializedUserId={initializedUserId}
                clinics={clinics}
                isTherapistHasGroups={isTherapistHasGroups}
                groupDataLoading={groupDataLoading}
                setAdditionalTherapistData={setAdditionalTherapistData}
                additionalTherapistData={additionalTherapistData}
                setGroupDataLoading={setGroupDataLoading}
                setAdditionalTherapistDat={setAdditionalTherapistData}
              />
            }
            placement="leftTop"
            trigger="hover"
            visible={isGroupsListVisible}
            onVisibleChange={handlePopoverVisible}>
            <Button variant="white" icon={<TeamOutlined />} />
          </Popover>
        </Tooltip>
      </Box>
      <Box mb={2}>
        <Tooltip title={email}>
          <Button
            variant="white"
            icon={<MailOutlined />}
            href={`mailto:${email}`}
          />
        </Tooltip>
      </Box>
      <Box>
        <Tooltip title={t('Remove user completely')}>
          <Remove
            popconfirmPlacement="bottomRight"
            type="primary"
            onSubmit={handleRemove}
            icon
            confirmLabel={t('Yes, remove')}
            cancelLabel={t('No, keep')}
            itemName={displayName}
          />
        </Tooltip>
      </Box>
    </Fragment>
  )

  return (
    <Spin size="large" spinning={Boolean(isSpinningActive)}>
      <UserCard avatarUrl={avatarUrl} actions={actions}>
        <Title
          mb={2}
          level={4}
          color="white"
          textShadow="var(--ql-color-black) 1px 0 10px">
          {displayName}
        </Title>
      </UserCard>
    </Spin>
  )
}

TherapistSimpleView.propTypes = {}

export default TherapistSimpleView
