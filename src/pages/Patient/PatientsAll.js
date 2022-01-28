import React, { Fragment, useEffect, useMemo, useState } from 'react'
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
import {
  FINISHED_STATUS,
  ONGOING_STATUS
} from 'bioflow/constants/groupStatuses'
import { useBioflowAccess } from 'bioflow/hooks'

const DATE_FORMAT = 'D MM YYYY'
const TODAY_DATE = moment().format(DATE_FORMAT)
const TOMORROW_DATE = moment().add(1, 'days').format(DATE_FORMAT)

const PatientsAll = () => {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { _id: therapistId } = useUserContext()
  const { isTherapistAdmin } = useBioflowAccess()
  const { update } = useSaveData()

  const [groups] = useCollectionData(
    firebase
      .firestore()
      .collection(GROUPS_MODEL_NAME)
      .where('status', '==', ONGOING_STATUS)
  )

  //[COMPONENT STATE HOOKS]
  const [filteredList, setFilteredList] = useState({})

  //[COMPUTED PROPERTIES]
  const filteredGroups = useMemo(
    () =>
      isTherapistAdmin
        ? groups
        : groups?.filter(({ therapists }) =>
            Object.keys(therapists).includes(therapistId)
          ),
    [groups, isTherapistAdmin]
  )

  const patients = useMemo(() => {
    return filteredGroups?.length
      ? filteredGroups
          ?.map((group) =>
            group?.patients?.map((patient, index) => ({
              ...patient,
              name: (
                <Fragment>
                  {group?.weekNumber} {patient.clinicName}
                  <strong>
                    {' '}
                    {t('Patient')} {index + 1}
                  </strong>
                </Fragment>
              ),
              patientId: index,
              groupId: group?._id,
              weekNumber: group?.weekNumber,
              patients: group?.patients,
              firstDay: group?.firstDay,
              fourthDay: group?.fourthDay
            }))
          )
          ?.flat()
          ?.filter((patient) => patient)
      : []
  }, [filteredGroups])

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
    const patient = { ...patientData?.patients[patientData?.patientId] }

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

    patientData.patients[patientData?.patientId] = patient

    if (patientData?.groupId && patientData?.patients?.length) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: patientData.groupId,
        data: { patients: patientData.patients }
      })

      //if today three month day and bio was delivered for all patients
      //set group status as finished
      threeMonthDay &&
        changeToFinishedGroupStatus(
          threeMonthDay,
          patientData?.groupId,
          patientData?.patients
        )
    }
  }

  // [USE_EFFECTS]
  useEffect(() => {
    let isComponentMounted = true

    if (patients?.length && isComponentMounted) {
      const dates = [TODAY_DATE, TOMORROW_DATE]
      const buf = {}
      //create lists of patients for current day and tomorrow

      dates.forEach((date) => {
        buf[date] = patients?.filter((patient) =>
          [
            moment(patient?.firstDay?.toDate?.()).format(DATE_FORMAT),
            moment(patient?.fourthDay?.toDate?.()).format(DATE_FORMAT),
            patient?.threeMonthDay &&
              moment(patient.threeMonthDay.toDate()).format(DATE_FORMAT)
          ].includes(date)
        )
      })
      isComponentMounted && setFilteredList(buf)
    }

    return () => {
      isComponentMounted = false
    }
  }, [patients])

  return (
    <PageWrapper
      headingProps={{
        title: t('Patients'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <Title level={4} mb={3}>
        {t('Today')}
      </Title>

      <ListWithCreate
        grid={{ gutter: [16, 0], xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
        emptyText={t('There is no patients for today')}
        withCreate={false}
        dataSource={filteredList[TODAY_DATE]}>
        <PatientSimpleView onDeliverBio={onDeliverBio} />
      </ListWithCreate>

      <Title level={4} mb={3} mt={3}>
        {t('Tomorrow')}
      </Title>
      <ListWithCreate
        grid={{ gutter: [16, 0], xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
        emptyText={t('There is no patients for tomorrow')}
        withCreate={false}
        dataSource={filteredList?.[TOMORROW_DATE]}>
        <PatientSimpleView onDeliverBio={onDeliverBio} />
      </ListWithCreate>
    </PageWrapper>
  )
}

export default PatientsAll
