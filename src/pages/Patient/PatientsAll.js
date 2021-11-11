import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper, Title } from '@qonsoll/react-design'
import { ListWithCreate } from 'app/components'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import { PatientSimpleView } from 'bioflow/domains/Patient/components'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'
import {
  FINISHED_STATUS,
  ONGOING_STATUS
} from 'bioflow/constants/groupStatuses'

const DATE_FORMAT = 'D MMM YYYY'
const TODAY_DATE = moment().format(DATE_FORMAT)
const TOMORROW_DATE = moment().add(1, 'days').format(DATE_FORMAT)

function PatientsAll() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { _id: therapistId } = useUserContext()
  const { update } = useSaveData()

  const [groups] = useCollectionData(
    therapistId &&
      firebase
        .firestore()
        .collection(GROUPS_MODEL_NAME)
        .where(`therapists.${therapistId}`, '!=', '')
  )

  //[COMPONENT STATE HOOKS]
  const [filteredList, setFilteredList] = useState({})

  //[COMPUTED PROPERTIES]
  const filteredGroups = useMemo(
    () => groups?.filter((group) => group?.status === ONGOING_STATUS),
    [groups]
  )
  const patients = useMemo(
    () =>
      filteredGroups
        ?.map((group) =>
          group?.patients?.map((patient) => ({
            ...patient,
            name: (
              <>
                {_.trimEnd(
                  _.initial(patient.generated).join(''),
                  patient.initial.toUpperCase()
                )}
                <strong>{patient.initial.toUpperCase()}</strong>
              </>
            ),
            groupId: group?._id,
            patients: group?.patients,
            firstDay: group?.firstDay,
            fourthDay: group?.fourthDay
          }))
        )
        ?.flat()
        ?.filter((patient) => patient),
    [filteredGroups]
  )

  const sortedPatientsList = useMemo(() => {
    return patients?.length
      ? patients.sort((a, b) => (a?.id > b?.id && 1) || -1)
      : []
  }, [patients])

  //[CLEAN FUNCTIONS]
  const changeToFinishedGroupStatus = (threeMonthDay, groupId, patients) => {
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
          id: groupId,
          data: { status: FINISHED_STATUS }
        })
    }
  }

  const onDeliverBio = async (patientData) => {
    const patient = _.remove(
      patientData?.patients,
      ({ id }) => id === patientData.id
    )[0]
    const { firstDay, fourthDay, threeMonthDay } = patientData || {}
    const todayDate = moment().format(DATE_FORMAT)
    const colectedBioFieldNames = [
      'firstDayBIOCollected',
      'fourthDayBIOCollected',
      'threeMonthDayBIOCollected'
    ]
    const dates = [firstDay, fourthDay, threeMonthDay]

    dates.forEach((date, index) => {
      if (date && moment(date.toDate()).format(DATE_FORMAT) === todayDate) {
        patient[colectedBioFieldNames[index]] = true
      }
    })

    if (patientData?.groupId && patientData?.patients?.length) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: patientData.groupId,
        data: { patients: [...patientData.patients, patient] }
      })

      //if today three month day and bio was delivered for all patients
      //set group status as finished
      changeToFinishedGroupStatus(
        threeMonthDay,
        patientData?.groupId,
        patientData?.patients
      )
    }
  }

  // [USE_EFFECTS]
  useEffect(() => {
    if (sortedPatientsList?.length) {
      const dates = [TODAY_DATE, TOMORROW_DATE]
      const buf = {}
      //create lists of patients for current day and tomorrow

      dates.forEach((date) => {
        buf[date] = sortedPatientsList?.filter((patient) =>
          [
            moment(patient?.firstDay?.toDate?.()).format(DATE_FORMAT),
            moment(patient?.fourthDay?.toDate?.()).format(DATE_FORMAT),
            patient?.threeMonthDay &&
              moment(patient.threeMonthDay.toDate()).format(DATE_FORMAT)
          ].includes(date)
        )
      })
      setFilteredList(buf)
    }
  }, [sortedPatientsList])

  return (
    <PageWrapper
      headingProps={{
        title: t('Patients'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <Title level={4} mb={2}>
        {t('Today')}
      </Title>
      <ListWithCreate
        emptyText={t('There is no patients for today')}
        withCreate={false}
        dataSource={filteredList[TODAY_DATE]}>
        <PatientSimpleView onDeliverBio={onDeliverBio} />
      </ListWithCreate>

      <Title level={4} mb={2}>
        {t('Tomorrow')}
      </Title>
      <ListWithCreate
        emptyText={t('There is no patients for tomorrow')}
        withCreate={false}
        dataSource={filteredList[TOMORROW_DATE]}>
        <PatientSimpleView onDeliverBio={onDeliverBio} />
      </ListWithCreate>
    </PageWrapper>
  )
}

export default PatientsAll
