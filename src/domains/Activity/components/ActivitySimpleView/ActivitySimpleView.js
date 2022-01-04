import React, { Fragment, useMemo, useState } from 'react'
import moment from 'moment'
import { useTranslations } from '@qonsoll/translation'
import { Tooltip, Modal } from 'antd'
import {  Button, Col, Row, Text } from '@qonsoll/react-design'
import { useActivities} from 'bioflow/hooks'
import { ActivityAdvancedView } from '../'

function ActivitySimpleView(props) {
  const { _createdAt, additionalData, type, isTriggeredByAdmin } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { getActivityTextByType } = useActivities()

  const [isModalVisible, setIsModalVisible] = useState()
  const activityText = getActivityTextByType(
    additionalData,
    type,
    isTriggeredByAdmin
  )
  
  const additionalDataFields = useMemo(
    () => ({
      clinicName: t('Clinic'),
      adminDisplayName: t('Admin display name'),
      adminEmail: t('Admin email'),
      therapistDisplayName: t('Therapist display name'),
      therapistEmail: t('Therapist email'),
      therapistRole: t('Therapist role in group'),
      invitedTherapistDisplayName: t('Invited therapist display name'),
      invitedTherapistEmail: t('Invited therapist email'),
      invitedTherapistRole: t('Invited therapist role in group'),
      removedTherapistDisplayName: t('Removed therapist display name'),
      removedTherapistEmail: t('Removed therapist email'),
      removedTherapistRole: t('Removed Therapist role in group'),
      patientDisplayName: t('Patient display name'),
      groupName: t('Group'),
      groupClinicName: t('Group clinic'),
      groupStudyName: t('Group study'),
      groupDisorderName: t('Group disorder'),
      studyName: t('Study')
    }),
    [t]
  )

  const additionalDataLength = useMemo(
    () =>
      Object.keys(additionalDataFields)?.filter(
        (additionalDataKey) => additionalData?.[additionalDataKey]
      )?.length,
    [additionalData, additionalDataFields]
  )

  const onModalOpen = () =>{
    setIsModalVisible(true)
  }

  const onModalCancel = ()=>{
    setIsModalVisible(false)
  }

  return (
    <Fragment>
      <Row noOuterGutters my={0}>
        <Col cw="auto" v="center">
          <Text type="secondary">
            {moment(_createdAt.toDate?.()).format('HH:mm')}
          </Text>
        </Col>
        <Col v="center">
          <Text type="secondary">{activityText}</Text>
        </Col>
        <Col cw="auto" v="center">
          <Button type='text' onClick={onModalOpen}>
            <Text underline type="secondary">
              {t('details')}
            </Text>
          </Button>
        </Col>
      </Row>

      <Modal 
        visible={isModalVisible}
        footer={false}
        title={t('Activity details')}
        style={{ top: 'calc(50vh - 200px)' }}
        onCancel={onModalCancel}>
          <ActivityAdvancedView 
            {...props}
            additionalData={additionalData}
            additionalDataFields={additionalDataFields}
          />
      </Modal>
    </Fragment>
  )
}

ActivitySimpleView.propTypes = {}

export default ActivitySimpleView
