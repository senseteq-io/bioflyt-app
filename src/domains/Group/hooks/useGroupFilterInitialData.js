import { useMemo } from 'react'
import {
  useCollectionData,
  useDocumentData
} from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import {
  GROUPS_MODEL_NAME,
  STUDIES_MODEL_NAME,
  THERAPIST_PROFILES_MODEL_NAME
} from 'bioflow/constants/collections'
import { DISORDERS_MODEL_NAME, CLINICS_MODEL_NAME } from 'app/constants/models'
import { useUserContext } from 'app/domains/User/contexts'
import { useBioflowAccess } from 'bioflow/hooks'
import _ from 'lodash'

const useGroupFilterInitialData = () => {
  const {
    _id: therapistId,
    clinics: therapistClinics,
    bioflowTherapistProfileId
  } = useUserContext()
  const { isAdmin, isTherapistAdmin } = useBioflowAccess()
  const firestore = firebase.firestore()

  const isAdminOrTherapistAdminRole = isAdmin || isTherapistAdmin
  const [therapistProfile] = useDocumentData(
    bioflowTherapistProfileId &&
      firestore
        .collection(THERAPIST_PROFILES_MODEL_NAME)
        .doc(bioflowTherapistProfileId)
  )
  const [studies] = useCollectionData(
    isAdminOrTherapistAdminRole
      ? firestore.collection(STUDIES_MODEL_NAME)
      : therapistProfile?.studies &&
          firestore
            .collection(STUDIES_MODEL_NAME)
            .where('_id', 'in', therapistProfile?.studies)
  )
  const [disorders] = useCollectionData(
    isAdminOrTherapistAdminRole
      ? firestore.collection(DISORDERS_MODEL_NAME)
      : firestore
          .collection(DISORDERS_MODEL_NAME)
          .where('clinicId', 'in', Object.keys(therapistClinics))
  )
  const [groups] = useCollectionData(
    isAdminOrTherapistAdminRole
      ? firestore.collection(GROUPS_MODEL_NAME)
      : firestore
          .collection(GROUPS_MODEL_NAME)
          .where(`therapists.${therapistId}`, '!=', '')
  )
  const [clinics] = useCollectionData(
    isAdminOrTherapistAdminRole
      ? firestore.collection(CLINICS_MODEL_NAME)
      : firestore
          .collection(CLINICS_MODEL_NAME)
          .where('_id', 'in', Object.keys(therapistClinics))
  )

  const groupsWeekNumbers = useMemo(() => {
    //get week numbers of all groups
    let weekNumbers = groups?.map((group) => group?.weekNumber)
    //create array of unique values for filter select
    weekNumbers = [...new Set(weekNumbers)]
    return weekNumbers
  }, [groups])

  const numberOfPatients = _.range(1, 7)

  const formattedDisorders = useMemo(() => {
    let clinicDisorders = {}
    //iterate by therapist therapistClinics and then iterate by all disorders
    //to get disorder of current clinic
    //and create object in format [clinicId]: [array of this clinic disorders]
    clinics?.forEach(({ _id, name }) => {
      clinicDisorders[name] = disorders?.filter(
        ({ clinicId }) => clinicId === _id
      )
    })
    return clinicDisorders
  }, [disorders, clinics])

  return {
    groupsWeekNumbers,
    numberOfPatients,
    formattedDisorders,
    studies
  }
}

export default useGroupFilterInitialData
