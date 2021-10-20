import React from 'react'
import { ListWithCreate } from 'app/components'
import { STUDIES } from 'bioflow/constants/collections'
import { StudySimpleView } from '..'
import { useHistory } from 'react-router'
import { BIOFLOW_ADMIN_STUDY_CREATE_PATH } from 'bioflow/constants/paths'

const MOCK_STUDIES = [
  { name: 'nose' },
  { name: 'leg' },
  { name: 'brain' },
  { name: 'hand' },
  { name: 'ear' }
]

function StudyList(props) {
  // const { WRITE_PROPS_HERE } = props
  // const { ADDITIONAL_DESTRUCTURING_HERE } = user

  // [ADDITIONAL HOOKS]
  const history = useHistory()

  // [COMPONENT STATE HOOKS]
  // const [state, setState] = useState({})

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const onCreate = () => {
    history.push(BIOFLOW_ADMIN_STUDY_CREATE_PATH)
  }

  return (
    <ListWithCreate
      createHeight={64}
      // collection={STUDIES}
      onCreate={onCreate}
      dataSource={MOCK_STUDIES}>
      <StudySimpleView />
    </ListWithCreate>
  )
}

StudyList.propTypes = {}

export default StudyList
