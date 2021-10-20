import React from 'react'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'

const MOCK_PATIENTS = [
  { name: '360OsloOCDGS' },
  { name: '360OsloOCDAT' },
  { name: '360OsloOCDBC' },
  { name: '360OsloOCDDT' }
]

function PatientsList(props) {
  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  return (
    <ListWithCreate withCreate={false} dataSource={MOCK_PATIENTS}>
      <PatientSimpleView />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
