import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import firebase from 'firebase'
import { GROUPS_MODEL_NAME, STUDIES_MODEL_NAME } from "bioflow/constants/collections"
import { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } from "app/constants/models"

const useGroupFullData = (groupId) => {
  const [groupData] = useDocumentDataOnce(
    groupId && firebase.firestore().collection(GROUPS_MODEL_NAME).doc(groupId)
  )
  const [groupClinicData] = useDocumentDataOnce(
    groupId &&
      groupData?.clinicId &&
      firebase.firestore().collection(CLINICS_MODEL_NAME).doc(groupData?.clinicId)
  )
  const [groupDisorderData] = useDocumentDataOnce(
    groupId &&
      groupData?.disorderId &&
      firebase.firestore().collection(DISORDERS_MODEL_NAME).doc(groupData?.disorderId)
  )
  const [groupStudyData] = useDocumentDataOnce(
    groupId &&
      groupData?.studyId &&
      firebase.firestore().collection(STUDIES_MODEL_NAME).doc(groupData?.studyId)
  )

  return {
    ...groupData,
    clinic: groupClinicData,
    disorder: groupDisorderData,
    study: groupStudyData
  }
}

export default useGroupFullData
