import React, { Fragment, useMemo } from 'react'
import { Tooltip, Spin, notification } from 'antd'
import { Remove, Title, Button, Box } from '@qonsoll/react-design'
import { DeleteUserHelper } from 'helpers'
import { MailOutlined } from '@ant-design/icons'
import { useTranslations } from 'app/contexts'
import { useUI } from 'app/domains/UI/contexts'
import { useUserContext } from 'app/domains/User/contexts'
import { REMOVE_THERAPIST_INVITE } from 'bioflow/constants/activitiesTypes'
import { useActivities } from 'bioflow/hooks'
import { TherapistCard } from '..'

function TherapistInviteView(props) {
  const { receiverName, receiverEmail, initializedUserId } = props

  // [ADDITIONAL HOOKS]
  const [{ userIdToDeletionRequestProcessing }, UIDispatch] = useUI()
  const { t } = useTranslations()
  const { createActivity } = useActivities()
  const user = useUserContext()

  // [COMPUTED PROPERTIES]
  const isSpinningActive = userIdToDeletionRequestProcessing[initializedUserId]
  const adminDisplayName = useMemo(
    () =>
      user?.firstName &&
      user?.lastName &&
      `${user?.firstName} ${user?.lastName}`,
    [user]
  )

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
        description: t(
          'Therapist invitation was completely deleted from the system'
        ),
        placement: 'topRight'
      },
      error: {
        message: t('Error'),
        description: t('Server responded with 404, cannot complete operation'),
        placement: 'topRight'
      }
    }

    // starting the spinner before request
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
      type: REMOVE_THERAPIST_INVITE,
      additionalData: {
        adminDisplayName,
        adminEmail: user?.email,
        removedTherapistDisplayName: receiverName,
        removedTherapistEmail: receiverEmail
      }
    })

    notification.success({
      message: t('Success'),
      description: t('Bioflow therapist invitation was successfully removed')
    })
  }

  const actions = (
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
  )

  return (
    <Spin size="large" spinning={Boolean(isSpinningActive)}>
      <TherapistCard rightActions={actions}>
        <Title
          level={4}
          color="white"
          textShadow="var(--ql-color-black) 1px 0 10px">
          {receiverName}
        </Title>
      </TherapistCard>
    </Spin>
  )
}

TherapistInviteView.propTypes = {}

export default TherapistInviteView
