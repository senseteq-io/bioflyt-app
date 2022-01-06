import firebase from 'firebase'
import moment from 'moment'
import React, { Fragment, useMemo, useState } from 'react'
import { Box, Container, NoData, Spin, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import InView from 'react-intersection-observer'
import { message } from 'antd'
// import { ACTIVITIES_MODEL_NAME } from 'bioflow/constants/collections'

const ACTIVITIES_MODEL_NAME = 'bioflowTestActivities'
const order = { field: '_createdAt', type: 'desc' }
const limit = 15
const idField = '_id'

function ActivitiesAll() {
  // [DATA_FETCH]
  const [initialActivities] = useCollectionData(
    firebase.firestore().collection(ACTIVITIES_MODEL_NAME).orderBy(order.field, order.type).limit(20)
  )

  const { t } = useTranslations()

  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState(initialActivities || [])
  const [lastElement, setLastElement] = useState(_.last(initialActivities))
  const [isEndOfList, setIsEndOfList] = useState(false)

  const data = useMemo(() => 
    activities?.length ? activities : initialActivities,
    [activities, initialActivities]
  ) 

  //[CLEAN FUNCTIONS]
  const handleUpdate = async (isView) => {
    if (isView && (lastElement || _.last(initialActivities))) {
      !isEndOfList && setLoading(true)
      try {
        // Get new data snapshot
        const res = await firebase.firestore().collection(ACTIVITIES_MODEL_NAME)
          .orderBy(order.field, order.type)
          .startAfter((lastElement || _.last(initialActivities))?.[order.field])
          .limit(limit)
          .get()
        if (!res.size) {
          // If get all collection data
          onReachEnd?.()
          setIsEndOfList(true)
          setLoading(false)
        } else {
          // Transform data snapshot to valid data object
          const resData = res.docs.map((snapshot) => {
            if (idField) {
              return {
                ...snapshot.data(),
                [idField]: snapshot.id
              }
            }
            return snapshot.data()
          })
          // Attach new data to array
          setActivities((data) => data?.length ? data?.concat(resData): initialActivities.concat(resData))
          //get last element to know where to start new query
          setLastElement(_.last(resData))
        }
      } catch (error) {
        console.log(error)
        message.error(t('Error occurred during data fetch'))
      }
    }
  }

  // [COMPUTED PROPERTIES]
  const actionsDates = data?.map(({ _createdAt }) =>
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
            dataSource={data?.filter(
              (activity) =>
                moment(activity._createdAt.toDate?.()).format('DD.MM.YYYY') ===
                date
            )}
          />
        </Fragment>
      ))}
      <InView as={Box} onChange={handleUpdate}>
        {loading && <Box display='flex' flex={1} justifyContent='center' alignItems='center'  py={2}><Spin /></Box>}
      </InView>
    </Container>
  )
}

export default ActivitiesAll
