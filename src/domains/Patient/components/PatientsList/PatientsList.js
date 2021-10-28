import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'

const DATE_FORMAT = 'D MMM YYYY'

function PatientsList(props) {
  const { patients, startDay, fourthDay } = props

  // [ADDITIONAL_HOOKS]
  const { id } = useParams()
  const { update } = useSaveData()

  // [CLEAN_FUNCTIONS]
  const onDeliverBio = async (patientData) => {
    const patient = _.remove(patients, ({ id }) => id === patientData.id)[0]
    if (
      moment(patient.firstDay).format(DATE_FORMAT) ===
      moment().format(DATE_FORMAT)
    ) {
      patient.firstDayBIOCollect = true
    } else if (
      moment(patient.fourthDay).format(DATE_FORMAT) ===
      moment().format(DATE_FORMAT)
    ) {
      patient.forthDayBIOCollect = true
    }

    await update({
      collection: GROUPS_MODEL_NAME,
      id,
      data: { patients: [...patients, patient] }
    })
  }

  return (
    <ListWithCreate
      withCreate={false}
      dataSource={patients?.map(({ generated, ...rest }) => ({
        name: generated,
        ...rest
      }))}>
      <PatientSimpleView
        startDay={startDay}
        fourthDay={fourthDay}
        onDeliverBio={onDeliverBio}
      />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
