import { ACTIVITIES, GROUPS } from 'bioflow/constants/collections'
import firebase from 'firebase'
import moment from 'moment'
import React from 'react'
import { Box, PageWrapper, Title } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useTranslations } from '@qonsoll/translation'
import {
  useCollectionData,
  useDocumentDataOnce
} from 'react-firebase-hooks/firestore'
import { useHistory, useParams } from 'react-router-dom'

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

  return (
    <PageWrapper
      onBack={() => history.goBack()}
      headingProps={{
        title: `${t('Week')} ${groupData?.weekNumber || ''}`,
        subTitle: t('Activities'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
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
