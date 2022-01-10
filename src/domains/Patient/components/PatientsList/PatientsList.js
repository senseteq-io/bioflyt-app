import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import _ from 'lodash'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'
import { FINISHED_STATUS } from 'bioflow/constants/groupStatuses'

const DATE_FORMAT = 'D MMM YYYY'
const TODAY_DATE = moment().format(DATE_FORMAT)

function PatientsList(props) {
  const { patients, groupId, firstDay, fourthDay } = props

  // [ADDITIONAL_HOOKS]
  const { id } = useParams()
  const { update } = useSaveData()

  //[COMPUTED PROPERTIES]
  const sortedPatientsList = useMemo(
    () => patients?.sort((a, b) => (a?.id > b?.id && 1) || -1),
    [patients]
  )

  // [CLEAN_FUNCTIONS]
  const changeToFinishedGroupStatus = (threeMonthDay) => {
    const isTodayLastDayBioCollect =
      threeMonthDay &&
      moment(threeMonthDay.toDate()).format(DATE_FORMAT) === TODAY_DATE

    if (isTodayLastDayBioCollect) {
      const isAllPatientsBioDelivered = patients?.every(
        (patient) => !!patient?.threeMonthDayBIOCollected
      )
      isAllPatientsBioDelivered &&
        update({
          collection: GROUPS_MODEL_NAME,
          id,
          data: { status: FINISHED_STATUS }
        })
    }
  }

  const onDeliverBio = async (patientData) => {
    const patient = _.remove(patients, ({ id }) => id === patientData.id)[0]
    const { firstDay, fourthDay, threeMonthDay } = patientData || {}
    const colectedBioFieldNames = [
      'firstDayBIOCollected',
      'fourthDayBIOCollected',
      'threeMonthDayBIOCollected'
    ]
    const dates = [firstDay, fourthDay, threeMonthDay]

    dates.forEach((date, index) => {
      if (date && moment(date.toDate()).format(DATE_FORMAT) === TODAY_DATE) {
        patient[colectedBioFieldNames[index]] = true
      }
    })
    await update({
      collection: GROUPS_MODEL_NAME,
      id,
      data: { patients: [...patients, patient] }
    })
    //if today three month day and bio was delivered for all patients
    //set group status as finished
    changeToFinishedGroupStatus(threeMonthDay)
  }

  return (
    <ListWithCreate
      withCreate={false}
      dataSource={sortedPatientsList?.map(({ generated, ...rest }) => ({
        name: (
          <>
            {_.trimEnd(
              _.initial(generated).join(''),
              rest.initial.toUpperCase()
            )}
            <strong>{rest.initial.toUpperCase()}</strong>
          </>
        ),
        generated,
        ...rest
      }))}>
      <PatientSimpleView
        firstDay={firstDay}
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
