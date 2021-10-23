import { ACTIVITIES, GROUPS } from 'bioflow/constants/collections'
import firebase from 'firebase'
import moment from 'moment'
import React, { Fragment } from 'react'
import { Box, NoData, PageWrapper, Title } from '@qonsoll/react-design'
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
  BIOFLOW_ADMIN_GROUP_SHOW_PATH
} from 'bioflow/constants/paths'

function GroupActivitiesAll() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { id } = useParams()

  // [DATA_FETCH]
  const [groupData] = useDocumentDataOnce(
    firebase.firestore().collection(GROUPS).doc(id)
  )
  const [activities] = useCollectionData(
    firebase.firestore().collection(ACTIVITIES)
  )

  // [COMPUTED PROPERTIES]
  const actionsDates = activities
    ?.filter(({ groupId }) => groupId === id)
    ?.map(({ _createdAt }) =>
      moment(_createdAt.toDate?.()).format('DD.MM.YYYY')
    )
  const uniqueDates = actionsDates?.filter(
    (day, index, self) => self.indexOf(day) === index
  )
  const groupShowPath = generatePath(BIOFLOW_ADMIN_GROUP_SHOW_PATH, { id })

  const groupActivitiesBreadcrumbs = (
    <Fragment>
      <Breadcrumb.Item>
        <Link to={BIOFLOW_ADMIN_GROUPS_PATH}>{t('Groups')}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={groupShowPath}>Week {groupData?.weekNumber}</Link>
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
      {!uniqueDates?.length && (
        <Box>
          <NoData />
        </Box>
      )}
      {uniqueDates?.map((date) => (
        <>
          <Box my={3}>
            <Title type="secondary" level={5}>
              {date}
            </Title>
          </Box>
          <ActivitiesList
            dataSource={activities
              .filter(({ groupId }) => groupId === id)
              .filter(
                (activity) =>
                  moment(activity._createdAt.toDate?.()).format(
                    'DD.MM.YYYY'
                  ) === date
              )}
          />
        </>
      ))}
    </PageWrapper>
  )
}

export default GroupActivitiesAll
