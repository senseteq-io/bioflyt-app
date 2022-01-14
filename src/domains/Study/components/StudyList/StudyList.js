import firebase from 'firebase'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ListWithCreate } from 'app/components'
import { StudySimpleView } from '..'
import { BIOFLOW_ADMIN_STUDY_CREATE_PATH } from 'bioflow/constants/paths'
import { STUDIES_MODEL_NAME } from 'bioflow/constants/collections'

function StudyList() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()

  // [DATA_FETCH]
  const [studies = []] = useCollectionData(
    firebase.firestore().collection(STUDIES_MODEL_NAME)
  )
  // [CLEAN FUNCTIONS]
  const onCreate = () => {
    history.push(BIOFLOW_ADMIN_STUDY_CREATE_PATH)
  }

  return (
    <ListWithCreate createHeight={64} onCreate={onCreate} dataSource={studies}>
      <StudySimpleView />
    </ListWithCreate>
  )
}

export default StudyList
