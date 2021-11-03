import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import _ from 'lodash'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'

const DATE_FORMAT = 'D MMM YYYY'

function PatientsList(props) {
  const { patients, groupId, startDay, fourthDay } = props

  // [ADDITIONAL_HOOKS]
  const { id } = useParams()
  const { update } = useSaveData()

  //[COMPUTED PROPERTIES]
  const sortedPatientsList = useMemo(
    () => patients?.sort((a, b) => (a?.id > b?.id && 1) || -1),
    [patients]
  )

  // [CLEAN_FUNCTIONS]
  const onDeliverBio = async (patientData) => {
    const patient = _.remove(patients, ({ id }) => id === patientData.id)[0]
    const { startDay, fourthDay, threeMonthDay } = patientData || {}
    const todayDate = moment().format(DATE_FORMAT)

    if (
      startDay &&
      moment(startDay.toDate()).format(DATE_FORMAT) === todayDate
    ) {
      patient.firstDayBIOCollect = true
    } else if (
      fourthDay &&
      moment(fourthDay.toDate()).format(DATE_FORMAT) === todayDate
    ) {
      patient.fourthDayBIOCollect = true
    } else if (
      threeMonthDay &&
      moment(threeMonthDay.toDate()).format(DATE_FORMAT) === todayDate
    ) {
      patient.lastBIOCollect = true
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
      dataSource={sortedPatientsList?.map(({ generated, ...rest }) => ({
        name: generated,
        ...rest
      }))}>
      <PatientSimpleView
        startDay={startDay}
        fourthDay={fourthDay}
        groupId={groupId}
        patients={sortedPatientsList}
        onDeliverBio={onDeliverBio}
      />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
