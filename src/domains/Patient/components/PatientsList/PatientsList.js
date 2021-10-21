import React from 'react'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'

function PatientsList(props) {
  return (
    <ListWithCreate
      withCreate={false}
      dataSource={props.patients?.map(({ generated }) => ({
        name: generated
      }))}>
      <PatientSimpleView />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
