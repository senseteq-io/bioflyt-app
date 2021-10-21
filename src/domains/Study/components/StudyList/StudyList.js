import firebase from 'firebase'
import React from 'react'
import { ListWithCreate } from 'app/components'
import { STUDIES } from 'bioflow/constants/collections'
import {
  useCollectionData,
  useCollectionDataOnce
} from 'react-firebase-hooks/firestore'
import { StudySimpleView } from '..'
import { useHistory } from 'react-router'
import { BIOFLOW_ADMIN_STUDY_CREATE_PATH } from 'bioflow/constants/paths'

function StudyList() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()

  // [DATA_FETCH]
  const [studies = []] = useCollectionData(
    firebase.firestore().collection(STUDIES)
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
