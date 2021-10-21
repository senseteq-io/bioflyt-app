import { ACTIVITIES } from 'bioflow/constants/collections'
import firebase from 'firebase'
import moment from 'moment'
import React from 'react'
import { Box, Container, Title } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function ActivitiesAll() {
  // [DATA_FETCH]
  const [activities] = useCollectionData(
    firebase.firestore().collection(ACTIVITIES)
  )
  // [COMPUTED PROPERTIES]
  const actionsDates = activities?.map(({ _createdAt }) =>
    moment(_createdAt.toDate?.()).format('DD.MM.YYYY')
  )
  const uniqueDates = actionsDates?.filter(
    (day, index, self) => self.indexOf(day) === index
  )

  // [CLEAN FUNCTIONS]

  return (
    <Container mt={4}>
      {uniqueDates?.map((date) => (
        <>
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
        </>
      ))}
    </Container>
  )
}

ActivitiesAll.propTypes = {}

export default ActivitiesAll
