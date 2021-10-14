import { GroupAdvancedView } from 'bioflyt/domains/Group/components'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { ListWithCreate } from 'app/components'
import { GROUPS } from 'bioflyt/constants/collections'
import { useBioflowAccess } from 'bioflyt/hooks'
import {
  BIOFLOW_ADMIN_GROUP_CREATE_PATH,
  BIOFLOW_GROUP_CREATE_PATH
} from 'bioflyt/constants/paths'

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

  // [CLEAN_FUNCTIONS]
  const goToCreateGroup = () =>
    history.push(
      isAdmin ? BIOFLOW_ADMIN_GROUP_CREATE_PATH : BIOFLOW_GROUP_CREATE_PATH
    )

  return (
    <ListWithCreate
      grid={{
        gutter: [32, 16],
        column: 1
      }}
      createVariant="large"
      createText={t('Add group')}
      onCreate={goToCreateGroup}
      collection={GROUPS}
      withCreate
      dataSource={MOCK_GROUPS}>
      <GroupAdvancedView />
    </ListWithCreate>
  )
}

GroupsList.propTypes = {}

export default GroupsList
