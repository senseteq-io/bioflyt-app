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
import { ONGOING_STATUS } from 'bioflow/constants/groupStatuses'

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
            name: patient?.generated,
            groupId: group?._id,
            patients: group?.patients,
            startDay: group?.startDay,
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
  const onDeliverBio = async (patientData) => {
    const patient = _.remove(
      patientData?.patients,
      ({ id }) => id === patientData.id
    )[0]
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

    if (patientData?.groupId && patientData?.patients?.length) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: patientData.groupId,
        data: { patients: [...patientData.patients, patient] }
      })
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
            moment(patient?.startDay?.toDate?.()).format(DATE_FORMAT),
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
        <PatientSimpleView on DeliverBio={onDeliverBio} />
      </ListWithCreate>
    </PageWrapper>
  )
}

export default PatientsAll
