import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ListWithCreate } from 'app/components'
import { ClinicSimpleView } from '..'
import { useService } from 'bioflow/contexts/Service'
import { THERAPIST_USER_ROLE } from 'app/constants/userRoles'
import firebase from 'firebase'

function ClinicsList(props) {
  // [ADDITIONAL HOOKS]
  const {
    CLINICS_MODEL_NAME,
    BIOFLOW_CLINIC_PLACES_MODEL_NAME,
    USERS_MODEL_NAME
  } = useService()
  const [clinics] = useCollectionData(
    firebase.firestore().collection(CLINICS_MODEL_NAME)
  )
  const [places] = useCollectionData(
    firebase.firestore().collection(BIOFLOW_CLINIC_PLACES_MODEL_NAME)
  )
  const [therapists] = useCollectionData(
    firebase
      .firestore()
      .collection(USERS_MODEL_NAME)
      .where('role', '==', THERAPIST_USER_ROLE)
      .where('isTemporaryPasswordResolved', '==', true)
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
      <ClinicSimpleView places={places} therapists={therapists} />
    </ListWithCreate>
  )
}

ClinicsList.propTypes = {}

export default ClinicsList
