import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ListWithCreate } from 'app/components'
import { ClinicSimpleView } from '..'
import firebase from 'firebase'
import { CLINICS_MODEL_NAME } from 'app/constants/models'

function ClinicsList() {
  // [DATA_FETCH]
  const [clinics] = useCollectionData(
    firebase.firestore().collection(CLINICS_MODEL_NAME)
  )

  return (
    <ListWithCreate
      grid={{
        gutter: [32, 16],
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 4,
        xxl: 4
      }}
      dataSource={clinics}
      withCreate={false}>
      <ClinicSimpleView />
    </ListWithCreate>
  )
}

ClinicsList.propTypes = {}

export default ClinicsList
