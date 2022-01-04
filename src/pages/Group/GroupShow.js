import React, { Fragment } from 'react'
import { EditRemove } from 'app/components'
import { useSaveData } from 'app/hooks'
import { Box, Button, PageWrapper, Title } from '@qonsoll/react-design'
import { Breadcrumb } from 'antd'
import { PatientsList } from 'bioflow/domains/Patient/components'
import { LineChartOutlined } from '@ant-design/icons'
import { useHistory, useParams, generatePath, Link } from 'react-router-dom'
import { useBioflowAccess, useGroupFullData } from 'bioflow/hooks'
import { useTranslations } from '@qonsoll/translation'
import {
  useDocumentData,
  useCollectionData
} from 'react-firebase-hooks/firestore'
import {
  GROUPS_MODEL_NAME,
  NOTIFICATIONS_MODEL_NAME
} from 'bioflow/constants/collections'
import {
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH,
  BIOFLOW_ADMIN_GROUP_EDIT_PATH,
  BIOFLOW_GROUPS_PATH,
  BIOFLOW_GROUP_ACTIVITIES_PATH,
  BIOFLOW_GROUP_EDIT_PATH
} from 'bioflow/constants/paths'
import firebase from 'firebase'
import { REMOVE_GROUP } from 'bioflow/constants/activitiesTypes'
import _ from 'lodash'
import { useUserContext } from 'app/domains/User/contexts'


function GroupShow() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { id } = useParams()
  const { remove } = useSaveData()
  const { isAdmin } = useBioflowAccess()
  const { firstName, lastName, email, _id: userId } = useUserContext()

  const [groupData] = useDocumentData(
    firebase.firestore().collection(GROUPS_MODEL_NAME).doc(id)
  )
  
  const [notifications = []] = useCollectionData(
    firebase
      .firestore()
      .collection(NOTIFICATIONS_MODEL_NAME)
      .where('groupId', '==', id)
  )
  const groupFullData = useGroupFullData(id)
  const triggerUserData = isAdmin
    ? {
        adminDisplayName: `${firstName} ${lastName}`,
        adminEmail: email
      }
    : {
        therapistDisplayName: `${firstName} ${lastName}`,
        therapistEmail: email,
        therapistRole: _.capitalize?.(therapists?.[userId])
      }

  // [CLEAN FUNCTIONS]
  const goToActivities = () => {
    history.push(
      generatePath(
        isAdmin
          ? BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH
          : BIOFLOW_GROUP_ACTIVITIES_PATH,
        { id }
      )
    )
  }

  const goToGroupEdit = () => {
    history.push(
      generatePath(
        isAdmin ? BIOFLOW_ADMIN_GROUP_EDIT_PATH : BIOFLOW_GROUP_EDIT_PATH,
        { id }
      )
    )
  }

  const onRemoveGroup = async () => {
    await remove({ collection: GROUPS_MODEL_NAME, id, withNotification: true })
    notifications?.forEach((notification) => {
      remove({
        collection: NOTIFICATIONS_MODEL_NAME,
        id: notification._id,
        withNotification: false
      })
    })

    createActivity({
      isTriggeredByAdmin: isAdmin,
      type: REMOVE_GROUP,
      groupId: id || null,
      additionalData: {
        ...triggerUserData,
        groupName: groupData?.weekNumber,
        groupStatus: groupData?.status,
        groupClinicName: groupFullData?.clinic?.name || null,
        groupStudyName: groupFullData?.study?.name || null,
        groupDisorderName: groupFullData?.disorder?.name || null
      }
    })

    history.goBack()
  }

  const actionPanel = (
    <Box display="flex" alignItems="flex-start">
      <Button
        mr={3}
        type="text"
        icon={<LineChartOutlined />}
        onClick={goToActivities}>
        {t('Activities')}
      </Button>
      <Box mr={3}>
        <EditRemove onEdit={goToGroupEdit} onRemove={onRemoveGroup} />
      </Box>
    </Box>
  )

  const groupShowBreadcrumbs = (
    <Fragment>
      <Breadcrumb.Item>
        <Link to={isAdmin ? BIOFLOW_ADMIN_GROUPS_PATH : BIOFLOW_GROUPS_PATH}>
          {t('Groups')}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{`${t('Week')} ${
        groupData?.weekNumber
      }`}</Breadcrumb.Item>
    </Fragment>
  )

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: `${t('Week')} ${groupData?.weekNumber || ''}`,
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}
      breadcrumb={{
        props: { separator: '>' },
        children: groupShowBreadcrumbs
      }}
      action={actionPanel}>
      <Box>
        <Box mb={24}>
          <Title level={4}>{t('Patients')}</Title>
        </Box>
        <PatientsList
          patients={groupData?.patients}
          groupId={groupData?._id}
          firstDay={groupData?.firstDay}
          fourthDay={groupData?.fourthDay}
        />
      </Box>
    </PageWrapper>
  )
}

export default GroupShow
