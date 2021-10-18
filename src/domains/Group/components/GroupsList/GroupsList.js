import { Box, Title } from '@qonsoll/react-design'
import { List } from 'antd'

import { useClinicContext } from 'app/domains/Clinic/contexts'
import { GroupAdvancedView } from 'bioflow/domains/Group/components'
import firebase from 'firebase'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { AddItem } from 'app/components'
import { GROUPS } from 'bioflow/constants/collections'
import { useBioflowAccess } from 'bioflow/hooks'
import {
  BIOFLOW_ADMIN_GROUP_CREATE_PATH,
  BIOFLOW_GROUP_CREATE_PATH
} from 'bioflow/constants/paths'

const MOCK_GROUPS = [
  {
    _id: 'testID1',
    clinicId: 'o8ASa7FgK0zSFnwC0tDQ',
    weekNumber: 21,
    place: 'Khm',
    studyId: 'brain',
    disorderId: '2NkMMkFHxfJw4oXxbfcJ',
    patients: [1, 2, 3, 4],
    status: 'DRAFT',
    firstDay: 'monday',
    lastDay: 'thursday',
    therapists: [1, 2, 3, 4]
  },
  {
    _id: 'testID2',
    clinicId: 'o8ASa7FgK0zSFnwC0tDQ',
    weekNumber: 36,
    place: 'Oslo',
    studyId: 'nose',
    disorderId: '7acv1DIMX6WSppca9dEj',
    patients: [1, 2, 3, 4, 6, 5],
    status: 'ONGOING',
    firstDay: 'monday',
    lastDay: 'thursday',
    therapists: [1, 2, 3, 4]
  },
  {
    _id: 'testID3',
    clinicId: 'o8ASa7FgK0zSFnwC0tDQ',
    weekNumber: 37,
    place: 'Bergen',
    studyId: 'mouth',
    disorderId: 'LEMqVlks5jIqxRgfWUVR',
    patients: [1, 2],
    status: 'FUTURE',
    firstDay: 'monday',
    lastDay: 'thursday',
    therapists: [1, 2, 3, 4]
  },
  {
    _id: 'testID4',
    clinicId: 'o8ASa7FgK0zSFnwC0tDQ',
    weekNumber: 22,
    place: 'Kiev',
    studyId: 'leg',
    disorderId: '2NkMMkFHxfJw4oXxbfcJ',
    patients: [1, 2, 3, 4, 5],
    status: 'DRAFT',
    firstDay: 'monday',
    lastDay: 'thursday',
    therapists: [1, 2, 3, 4]
  }
]

function GroupsList() {
  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { isAdmin } = useBioflowAccess()
  const { _id: clinicId } = useClinicContext()
  // const [{ height }, boxRef] = useSize()

  // [DATA FETCH]
  const [list] = useCollectionData(
    clinicId &&
      firebase.firestore().collection(GROUPS).where('clinicId', '==', clinicId)
  )

  // [COMPONENT_STATE_HOOKS]
  const [sortedList, setSortedList] = useState({})

  // [CLEAN_FUNCTIONS]
  const goToCreateGroup = () =>
    history.push(
      isAdmin ? BIOFLOW_ADMIN_GROUP_CREATE_PATH : BIOFLOW_GROUP_CREATE_PATH
    )

  // [USE_EFFECTS]
  useEffect(() => {
    if (list) {
      const statuses = _.uniq(MOCK_GROUPS.map(({ status }) => status))
      const filteredList = {}

      statuses.forEach((status) => {
        filteredList[status] = _.filter(
          MOCK_GROUPS,
          (item) => item.status === status
        )
      })
      setSortedList(filteredList)
    }
  }, [list])
  return (
    <>
      <Box mb={4}>
        <AddItem
          onClick={goToCreateGroup}
          variant="large"
          createText={t('Add group')}
        />
      </Box>

      {sortedList['DRAFT'] && (
        <GroupFilteredList status={t('Draft')} data={sortedList['DRAFT']} />
      )}
      {sortedList['ONGOING'] && (
        <GroupFilteredList status={t('Ongoing')} data={sortedList['ONGOING']} />
      )}
      {sortedList['FUTURE'] && (
        <GroupFilteredList status={t('Future')} data={sortedList['FUTURE']} />
      )}
      {sortedList['FINISHED'] && (
        <GroupFilteredList
          status={t('Finished')}
          data={sortedList['FINISHED']}
        />
      )}
    </>
  )
}

const GroupFilteredList = ({ status, data }) => (
  <Box mb={3}>
    <Title level={4} mb={2}>
      {status}
    </Title>
    <List
      grid={{
        gutter: [32, 16],
        column: 1
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={item._id} style={{ width: '100%' }}>
          <GroupAdvancedView {...item} />
        </List.Item>
      )}
    />
  </Box>
)

GroupsList.propTypes = {}

export default GroupsList
