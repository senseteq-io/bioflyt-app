import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { List } from 'antd'
import { ClinicSimpleView } from '..'
import { useService } from 'bioflow/contexts/Service'
import firebase from 'firebase'

function ClinicsList(props) {
  // [ADDITIONAL HOOKS]
  const { CLINICS_MODEL_NAME } = useService()
  const [clinics] = useCollectionData(
    firebase.firestore().collection(CLINICS_MODEL_NAME)
  )

  return (
    <List>
      {clinics?.map((clinic, index) => (
        <List.Item key={index}>
          <ClinicSimpleView clinic={clinic} />
        </List.Item>
      ))}
    </List>
  )
}

ClinicsList.propTypes = {}

export default ClinicsList
