import firebase from 'firebase'
import {
  GROUPS_MODEL_NAME,
  STUDIES_MODEL_NAME
} from 'bioflow/constants/collections'
import { DISORDERS_MODEL_NAME, CLINICS_MODEL_NAME } from 'app/constants/models'

const getSnapshotsData = (requestResult) =>
  requestResult?.docs?.map((snapshot) => snapshot.data())

const getTherapistGroupsData = async (clinicIds, therapistId) => {
  //get all clinics data
  const clinicsSnapshots =
    clinicIds?.length &&
    (await firebase
      .firestore()
      .collection(CLINICS_MODEL_NAME)
      .where('_id', 'in', clinicIds)
      .get())
  const clinicsData = await getSnapshotsData(clinicsSnapshots).sort(
    (a, b) => a?.name - b?.name
  )

  //get data of therapist groups, to get group week number, disorder and study
  const therapistGroupsSnapshots = await firebase
    .firestore()
    .collection(GROUPS_MODEL_NAME)
    .where(`therapists.${therapistId}`, '!=', '')
    .get()
  const therapistGroups = await getSnapshotsData(therapistGroupsSnapshots)

  const sortedTherapistGroups = therapistGroups?.sort(
    (a, b) => b?.weekNumber - a?.weekNumber
  )

  //format groups array to object with dependency {clinicId}: {therapist groups of this clinic}
  const therapistGroupsFormatted = clinicIds
    ?.map((id) => ({
      [id]: sortedTherapistGroups?.filter((group) => group?.clinicId === id)
    }))
    .reduce(
      (obj, item) => (
        (obj[Object.keys(item)?.[0]] = Object.values(item)?.[0]), obj
      ),
      {}
    )

  const groupsFullData = { studies: {}, disorders: {} }

  //get all studies and disorders ids of therapist groups to fetch data by this ids
  therapistGroups?.forEach((group) => {
    groupsFullData.studies[group?.studyId] = null
    groupsFullData.disorders[group?.disorderId] = null
  })

  const studyIds = Object.keys(groupsFullData.studies)
  const disorderIds = Object.keys(groupsFullData.disorders)

  //fetch disorders and studies data by parsed ids
  const studiesSnapshots =
    studyIds?.length &&
    (await firebase
      .firestore()
      .collection(STUDIES_MODEL_NAME)
      .where('_id', 'in', studyIds)
      .get())
  const studies = await getSnapshotsData(studiesSnapshots)
  const disordersSnapshots =
    disorderIds?.length &&
    (await firebase
      .firestore()
      .collection(DISORDERS_MODEL_NAME)
      .where('_id', 'in', disorderIds)
      .get())
  const disorders = await getSnapshotsData(disordersSnapshots)

  //set study and disorder name for appropriate id as {studyId}: {studyName} to get name by id later
  studies?.forEach((study) => {
    groupsFullData.studies[study?._id] = study?.name
  })

  disorders?.forEach((disorder) => {
    groupsFullData.disorders[disorder?._id] = disorder?.name
  })

  return {
    clinicsData: clinicsData,
    groupsData: therapistGroupsFormatted,
    studiesData: groupsFullData?.studies,
    disordersData: groupsFullData?.disorders
  }
}

export default getTherapistGroupsData
