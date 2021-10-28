import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper, Title } from '@qonsoll/react-design'
import { useUserContext } from 'app/domains/User/contexts'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import { ListWithCreate } from 'app/components'
import { PatientSimpleView } from 'bioflow/domains/Patient/components'
import { useSaveData } from 'app/hooks'
import moment from 'moment'
import _ from 'lodash'

const dateFormat = 'DD-MM-yyyy'
const todayDate = moment().format(dateFormat)
const tomorrowDate = moment().add(1, 'days').format(dateFormat)

function PatientsAll() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { _id: therapistId } = useUserContext()
  const { update } = useSaveData()

  const [groups = []] = useCollectionData(
    firebase
      .firestore()
      .collection(GROUPS_MODEL_NAME)
      .where(`therapists.${therapistId}`, '>=', '')
  )

  //[COMPONENT STATE HOOKS]
  const [filteredList, setFilteredList] = useState({})

  const patients = useMemo(
    () =>
      groups
        ?.map((group) =>
          group?.patients?.map((patient) => ({
            ...patient,
            name: patient?.generated,
            groupId: group?._id,
            startDay: group?.startDay,
            fourthDay: group?.fourthDay
          }))
        )
        .flat(),
    [groups]
  )
  const sortedPatientsList = useMemo(() => {
    return patients
      ? patients.sort((a, b) =>
          moment
            .unix(b?.startDay?.seconds)
            .diff(moment.unix(a?.startDay?.seconds))
        )
      : []
  }, [patients])

  const onDeliverBio = async (patientData) => {
    const patient = _.remove(patients, ({ id }) => id === patientData.id)[0]
    if (moment(patient.firstDay).isSame(moment())) {
      patient.firstDayBIOCollect = true
    } else if (moment(patient.fourthDay).isSame(moment())) {
      patient.forthDayBIOCollect = true
    }
    if (patientData?.groupId) {
      await update({
        collection: GROUPS_MODEL_NAME,
        id: patientData.groupId,
        data: { patients: [...patients, patient] }
      })
    }
  }

  // [USE_EFFECTS]
  useEffect(() => {
    if (sortedPatientsList) {
      const dates = [todayDate, tomorrowDate]
      const buf = {}

      dates.forEach((date) => {
        buf[date] = sortedPatientsList?.filter((item) =>
          [
            moment(item?.startDay?.toDate?.()).format(dateFormat),
            moment(item?.fourthDay?.toDate?.()).format(dateFormat)
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
      {filteredList[todayDate] && (
        <Fragment>
          <Title level={4} mb={2}>
            {t('Today')}
          </Title>
          <ListWithCreate
            emptyText={t('There is no patients for today')}
            withCreate={false}
            dataSource={filteredList[todayDate]}>
            <PatientSimpleView onDeliverBio={onDeliverBio} />
          </ListWithCreate>
        </Fragment>
      )}

      {filteredList[tomorrowDate] && (
        <Fragment>
          <Title level={4} mb={2}>
            {t('Tomorrow')}
          </Title>
          <ListWithCreate
            emptyText={t('There is no patients for tomorrow')}
            withCreate={false}
            dataSource={filteredList[tomorrowDate]}>
            <PatientSimpleView onDeliverBio={onDeliverBio} />
          </ListWithCreate>
        </Fragment>
      )}
    </PageWrapper>
  )
}

export default PatientsAll
