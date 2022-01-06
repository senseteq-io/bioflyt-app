import firebase from 'firebase'
import React from 'react'
import { Container, Box, NoData } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { InfiniteList } from 'bioflow/components'
// import { ACTIVITIES_MODEL_NAME } from 'bioflow/constants/collections'

const ACTIVITIES_MODEL_NAME = 'bioflowTestActivities'
const order = { field: '_createdAt', type: 'desc' }
const limit = 20

function ActivitiesAll() {
  const activitiesQuery = firebase
    .firestore()
    .collection(ACTIVITIES_MODEL_NAME)
    .orderBy(order.field, order.type)

  // [DATA_FETCH]
  const [initialActivities] = useCollectionData(activitiesQuery.limit(limit))

  if (!initialActivities?.length) {
    return (
      <Box>
        <NoData />
      </Box>
    )
  }

  return (
    <Container mt={3}>
      <InfiniteList
        initialData={initialActivities}
        limit={limit}
        query={activitiesQuery}
        order={order}>
        {(activities) => <ActivitiesList dataSource={activities} />}
      </InfiniteList>
    </Container>
  )
}

export default ActivitiesAll
