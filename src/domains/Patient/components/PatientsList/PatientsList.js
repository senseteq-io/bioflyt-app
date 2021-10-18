import React from 'react'
import { List } from 'antd'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'
import { GROUPS } from 'bioflow/constants/collections'

const MOCK_PATIENTS = [
  { name: '360OsloOCDGS' },
  { name: '360OsloOCDAT' },
  { name: '360OsloOCDBC' },
  { name: '360OsloOCDDT' }
]

function PatientsList(props) {
  // const { WRITE_PROPS_HERE } = props
  // const { ADDITIONAL_DESTRUCTURING_HERE } = user

  // [ADDITIONAL HOOKS]
  // const { t } = useTranslation('translation')
  // const { currentLanguage } = t

  // [COMPONENT STATE HOOKS]
  // const [state, setState] = useState({})

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  return (
    <ListWithCreate
      grid={{
        gutter: [32, 8],
        column: 1
      }}
      withCreate={false}
      dataSource={MOCK_PATIENTS}>
      <PatientSimpleView />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
