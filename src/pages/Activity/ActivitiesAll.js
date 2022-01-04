import firebase from 'firebase'
import moment from 'moment'
import React, { Fragment } from 'react'
import { Box, Container, NoData, Title } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useCollectionData } from 'react-firebase-hooks/firestore'
// import { ACTIVITIES_MODEL_NAME } from 'bioflow/constants/collections'

const ACTIVITIES_MODEL_NAME = 'bioflowTestActivities'

function ActivitiesAll() {
  // [DATA_FETCH]
  const [activities] = useCollectionData(
    firebase.firestore().collection(ACTIVITIES_MODEL_NAME).limit(3)
  )
  // [COMPUTED PROPERTIES]
  const actionsDates = activities?.map(({ _createdAt }) =>
    moment(_createdAt.toDate?.()).format('DD.MM.YYYY')
  )
  const uniqueDates = actionsDates?.filter(
    (day, index, self) => self.indexOf(day) === index
  )

  return (
    <Container mt={3}>
      {!uniqueDates?.length && (
        <Box>
          <NoData />
        </Box>
      )}
      {uniqueDates?.map((date) => (
        <Fragment>
          <Box my={3}>
            <Title type="secondary" level={5}>
              {date}
            </Title>
          </Box>
          <ActivitiesList
            dataSource={activities.filter(
              (activity) =>
                moment(activity._createdAt.toDate?.()).format('DD.MM.YYYY') ===
                date
            )}
          />
        </Fragment>
      ))}
    </Container>
  )
}

export default ActivitiesAll
