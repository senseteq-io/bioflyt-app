import React, { Fragment, useMemo, useState } from 'react'
import {
  Button,
  Box,
  Title,
  Remove,
  Popover,
  Switch,
  Text
} from '@qonsoll/react-design'
import { notification, Tooltip, Spin } from 'antd'
import { DeleteUserHelper } from 'helpers'
import { MailOutlined, TeamOutlined } from '@ant-design/icons'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { useUserContext } from 'app/domains/User/contexts'
import { useUI } from 'app/domains/UI/contexts'
import firebase from 'firebase'
import { REMOVE_THERAPIST } from 'bioflow/constants/activitiesTypes'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import { useActivities } from 'bioflow/hooks'
import { TherapistGroupsList, TherapistCard } from '../'
import { useSaveData } from 'app/hooks'
import { USERS_MODEL_NAME } from 'app/constants/models'

function TherapistSimpleView(props) {
  const {
    firstName,
    lastName,
    email,
    clinics,
    avatarUrl,
    _id: initializedUserId,
    isBioflowTherapistAdmin
  } = props

  // [ADDITIONAL HOOKS]
  const [{ userIdToDeletionRequestProcessing }, UIDispatch] = useUI()
  const { t } = useTranslations()
  const { createActivity } = useActivities()
  const { update } = useSaveData()
  const user = useUserContext()

  const [therapistGroups] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(GROUPS_MODEL_NAME)
      .where(`therapists.${initializedUserId}`, '!=', '')
  )

  const [isGroupsListVisible, setIsGroupListVisible] = useState(false)

  // [COMPUTED PROPERTIES]
  const displayName = useMemo(
    () => firstName && lastName && `${firstName} ${lastName}`,
    [firstName, lastName]
  )
  const adminDisplayName = useMemo(
    () =>
      user?.firstName &&
      user?.lastName &&
      `${user?.firstName} ${user?.lastName}`,
    [user]
  )

  const isSpinningActive = userIdToDeletionRequestProcessing[initializedUserId]

  const isTherapistDeletionDisabled = useMemo(() => !!therapistGroups?.length, [
    therapistGroups
  ])

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
        adminDisplayName,
        adminEmail: user?.email,
        removedTherapistDisplayName: displayName,
        removedTherapistEmail: email
      }
    })

    notification.success({
      message: t('Success'),
      description: t('Bioflow therapist was successfully removed')
    })
  }

  const handlePopoverVisible = (visible) => {
    setIsGroupListVisible(visible)
  }

  const onSwitchTherapistRole = (value) => {
    update({
      id: initializedUserId,
      collection: USERS_MODEL_NAME,
      data: { isBioflowTherapistAdmin: value }
    })
  }

  const leftActions = (
    <Tooltip
      title={
        isTherapistDeletionDisabled &&
        `${t('This therapist has groups')}.\n ${t(
          'A therapist should not have any group to set him admin role'
        )}`
      }>
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="var(--ql-color-white)"
        borderRadius="var(--ql-border-radius-md)"
        px={3}
        py={2}>
        <Text mb={1} type="secondary" variant="caption1">
          {t('Admin').toUpperCase()}:
        </Text>

        <Switch
          checked={isBioflowTherapistAdmin}
          onChange={onSwitchTherapistRole}
          disabled={isTherapistDeletionDisabled && !isBioflowTherapistAdmin}
        />
      </Box>
    </Tooltip>
  )

  const rightActions = (
    <Fragment>
      <Box mb={2} display="flex" justifyContent="end">
        <Tooltip title={t('Therapist groups')}>
          <Popover
            content={
              <TherapistGroupsList
                initializedUserId={initializedUserId}
                clinics={clinics}
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
      <Box mb={2} display="flex" justifyContent="end">
        <Tooltip title={email}>
          <Button
            variant="white"
            icon={<MailOutlined />}
            href={`mailto:${email}`}
          />
        </Tooltip>
      </Box>
      <Box display="flex" justifyContent="end">
        <Tooltip title={t('Remove user completely')}>
          <Remove
            icon
            popconfirmPlacement="bottomRight"
            type="primary"
            confirmLabel={t('Yes, remove')}
            cancelLabel={t('No, keep')}
            itemName={displayName}
            disabled={isTherapistDeletionDisabled}
            onSubmit={handleRemove}
          />
        </Tooltip>
      </Box>
    </Fragment>
  )

  return (
    <Spin size="large" spinning={Boolean(isSpinningActive)}>
      <TherapistCard
        avatarUrl={avatarUrl}
        rightActions={rightActions}
        leftActions={leftActions}>
        <Title
          mb={2}
          level={4}
          color="white"
          textShadow="var(--ql-color-black) 1px 0 10px">
          {displayName}
        </Title>
      </TherapistCard>
    </Spin>
  )
}

TherapistSimpleView.propTypes = {}

export default TherapistSimpleView
