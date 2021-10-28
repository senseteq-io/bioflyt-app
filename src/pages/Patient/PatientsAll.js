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
import _ from 'lodash'

const DATE_FORMAT = 'D MMM YYYY'
const TODAY_DATE = moment().format(DATE_FORMAT)
const TOMORROW_DATE = moment().add(1, 'days').format(DATE_FORMAT)

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

  //[COMPUTED PROPERTIES]
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

  //[CLEAN FUNCTIONS]
  const onDeliverBio = async (patientData) => {
    const patient = _.remove(patients, ({ id }) => id === patientData.id)[0]
    if (moment(patient.firstDay).format(DATE_FORMAT) === TODAY_DATE) {
      patient.firstDayBIOCollect = true
    } else if (moment(patient.fourthDay).format(DATE_FORMAT) === TODAY_DATE) {
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
      const dates = [TODAY_DATE, TOMORROW_DATE]
      const buf = {}
      //create lists of patients for current day and tomorrow

      dates.forEach((date) => {
        buf[date] = sortedPatientsList?.filter((item) =>
          [
            moment(item?.startDay?.toDate?.()).format(DATE_FORMAT),
            moment(item?.fourthDay?.toDate?.()).format(DATE_FORMAT)
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
      <Fragment>
        <Title level={4} mb={2}>
          {t('Today')}
        </Title>
        <ListWithCreate
          emptyText={t('There is no patients for today')}
          withCreate={false}
          dataSource={filteredList[TODAY_DATE]}>
          <PatientSimpleView onDeliverBio={onDeliverBio} />
        </ListWithCreate>
      </Fragment>

      <Fragment>
        <Title level={4} mb={2}>
          {t('Tomorrow')}
        </Title>
        <ListWithCreate
          emptyText={t('There is no patients for tomorrow')}
          withCreate={false}
          dataSource={filteredList[TOMORROW_DATE]}>
          <PatientSimpleView onDeliverBio={onDeliverBio} />
        </ListWithCreate>
      </Fragment>
    </PageWrapper>
  )
}

export default PatientsAll
