import { useTranslations } from '@qonsoll/translation'
import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import moment from 'moment'
import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { PatientSimpleView } from '..'
import { ListWithCreate } from 'app/components'
import { FINISHED_STATUS } from 'bioflow/constants/groupStatuses'

const DATE_FORMAT = 'D MM YYYY'
const TODAY_DATE = moment().format(DATE_FORMAT)

function PatientsList(props) {
  const { patients, groupId, firstDay, fourthDay, weekNumber } = props

  // [ADDITIONAL_HOOKS]
  const { id } = useParams()
  const { update } = useSaveData()
  const { t } = useTranslations()

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
    const patient = { ...patients[patientData?.patientId] }
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

    patients[patientData?.patientId] = patient
    await update({
      collection: GROUPS_MODEL_NAME,
      id,
      data: { patients }
    })
    //if today three month day and bio was delivered for all patients
    //set group status as finished
    patientData?.threeMonthDay && changeToFinishedGroupStatus(threeMonthDay)
  }

  return (
    <ListWithCreate
      withCreate={false}
      dataSource={patients?.map(({ clinicName, ...rest }, index) => ({
        name: (
          <Fragment>
            {weekNumber} {clinicName}
            <strong>
              {' '}
              {t('Patient')} {index + 1}
            </strong>
          </Fragment>
        ),
        weekNumber,
        patientId: index,
        ...rest
      }))}>
      <PatientSimpleView
        firstDay={firstDay}
        fourthDay={fourthDay}
        groupId={groupId}
        patients={patients}
        onDeliverBio={onDeliverBio}
      />
    </ListWithCreate>
  )
}

PatientsList.propTypes = {}

export default PatientsList
