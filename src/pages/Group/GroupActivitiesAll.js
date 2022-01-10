import firebase from 'firebase'
import React, { Fragment } from 'react'
import { Box, NoData, PageWrapper } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useTranslations } from '@qonsoll/translation'
import {
  useCollectionData,
  useDocumentDataOnce
} from 'react-firebase-hooks/firestore'
import { Link, useHistory, useParams, generatePath } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import {
  BIOFLOW_ADMIN_GROUPS_PATH,
  BIOFLOW_ADMIN_GROUP_SHOW_PATH,
  BIOFLOW_GROUPS_PATH,
  BIOFLOW_GROUP_SHOW_PATH
} from 'bioflow/constants/paths'
import {
  ACTIVITIES_MODEL_NAME,
  GROUPS_MODEL_NAME
} from 'bioflow/constants/collections'
import { useBioflowAccess } from 'bioflow/hooks'
import { InfiniteList } from 'bioflow/components'

const order = { field: '_createdAt', type: 'desc' }

function GroupActivitiesAll() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { id } = useParams()
  const { isAdmin } = useBioflowAccess()

  // [DATA_FETCH]
  const [groupData] = useDocumentDataOnce(
    firebase.firestore().collection(GROUPS_MODEL_NAME).doc(id)
  )

  const groupActivitiesQuery = firebase
    .firestore()
    .collection(ACTIVITIES_MODEL_NAME)
    .where('groupId', '==', id)
    .orderBy('_createdAt', 'desc')

  const [initialActivities] = useCollectionData(groupActivitiesQuery.limit(15))

  const groupShowPath = generatePath(
    isAdmin ? BIOFLOW_ADMIN_GROUP_SHOW_PATH : BIOFLOW_GROUP_SHOW_PATH,
    { id }
  )

  const groupActivitiesBreadcrumbs = (
    <Fragment>
      <Breadcrumb.Item>
        <Link to={isAdmin ? BIOFLOW_ADMIN_GROUPS_PATH : BIOFLOW_GROUPS_PATH}>
          {t('Groups')}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={groupShowPath}>{`${t('Week')} ${
          groupData?.weekNumber
        }`}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{t('Group activities')}</Breadcrumb.Item>
    </Fragment>
  )

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Activities'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 16
      }}
      breadcrumb={{
        props: { separator: '>' },
        children: groupActivitiesBreadcrumbs
      }}>
      {!initialActivities?.length ? (
        <Box>
          <NoData />
        </Box>
      ) : (
        <InfiniteList
          initialData={initialActivities}
          limit={15}
          query={groupActivitiesQuery}
          order={order}>
          {(activities) => <ActivitiesList dataSource={activities} />}
        </InfiniteList>
      )}
    </PageWrapper>
  )
}

export default GroupActivitiesAll
