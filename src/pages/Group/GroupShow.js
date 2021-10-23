import React, { Fragment, useMemo } from 'react'
import { EditRemove } from 'app/components'
import { useSaveData } from 'app/hooks'
import { Box, Button, PageWrapper, Title } from '@qonsoll/react-design'
import { Breadcrumb } from 'antd'
import { PatientsList } from 'bioflow/domains/Patient/components'
import { LineChartOutlined } from '@ant-design/icons'
import {
  useHistory,
  useParams,
  generatePath,
  useLocation,
  Link
} from 'react-router-dom'
import { useBioflowAccess } from 'bioflow/hooks'
import { useTranslations } from '@qonsoll/translation'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { GROUPS } from 'bioflow/constants/collections'
import {
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH,
  BIOFLOW_GROUP_ACTIVITIES_PATH,
  BIOFLOW_GROUP_EDIT_PATH
} from 'bioflow/constants/paths'
import { DRAFT_STATUS } from 'bioflow/constants/groupStatuses'
import firebase from 'firebase'

function GroupShow() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { id } = useParams()
  const { remove } = useSaveData()
  const { isAdmin } = useBioflowAccess()

  const [groupData] = useDocumentData(
    firebase.firestore().collection(GROUPS).doc(id)
  )

  //[COMPUTED PROPERTIES]
  const isActivateDisabled = useMemo(() => groupData?.status !== DRAFT_STATUS, [
    groupData
  ])

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
    history.push(generatePath(BIOFLOW_GROUP_EDIT_PATH, { id }))
  }

  const onRemoveGroup = async () => {
    await remove({ collection: GROUPS, id, withNotification: true })
    history.goBack()
  }

  const activateGroup = () => {
    // setIsActivated(true)
  }

  const actionPanel = (
    <Box display="flex" alignItems="center">
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

      <Button
        type="primary"
        disabled={isActivateDisabled}
        onClick={activateGroup}>
        {t('Activate')}
      </Button>
    </Box>
  )

  const groupShowBreadcrumbs = (
    <Fragment>
      <Breadcrumb.Item>
        <Link to={BIOFLOW_ADMIN_GROUPS_PATH}>{t('Groups')}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Week {groupData?.weekNumber}</Breadcrumb.Item>
    </Fragment>
  )

  return (
    <PageWrapper
      onBack={() => history.goBack()}
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
          startDay={groupData?.startDay}
          fourthDay={groupData?.fourthDay}
        />
      </Box>
    </PageWrapper>
  )
}

export default GroupShow
