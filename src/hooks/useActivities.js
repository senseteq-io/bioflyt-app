import {
  CREATE_GROUP,
  ACTIVATE_GROUP,
  EDIT_GROUP,
  REMOVE_GROUP,
  ADD_THERAPIST_TO_GROUP,
  ADD_PATIENT_TO_GROUP,
  REMOVE_THERAPIST_FROM_GROUP,
  REMOVE_PATIENT_FROM_GROUP,
  DELIVER_BIO,
  SET_THREE_MONTH_DATE,
  CHANGE_CLINIC_BIOFLOW_ACCESS,
  INVITE_THERAPIST,
  REMOVE_THERAPIST,
  REMOVE_THERAPIST_INVITE,
  CREATE_STUDY,
  EDIT_STUDY,
  REMOVE_STUDY
} from 'bioflow/constants/activitiesTypes'
import firebase from 'firebase'
import { useUserContext } from 'app/domains/User/contexts'
import { useTranslations } from '@qonsoll/translation'
import { ACTIVITIES_MODEL_NAME } from 'bioflow/constants/collections'

const possibleAdditionalDataFields = {
  adminId: null,
  adminDisplayName: null,
  adminEmail: null,
  clinicId: null,
  clinicName: null,
  clinicBioflowAccess: null,
  therapistId: null,
  therapistDisplayName: null,
  therapistEmail: null,
  therapistRole: null,
  invitedTherapistId: null,
  invitedTherapistDisplayName: null,
  invitedTherapistEmail: null,
  invitedTherapistRole: null,
  removedTherapistId: null,
  removedTherapistDisplayName: null,
  removedTherapistEmail: null,
  removedTherapistRole: null,
  patientId: null,
  patientDisplayName: null,
  groupId: null,
  groupName: null,
  groupStatus: null,
  groupClinicId: null,
  groupClinicName: null,
  groupStudyId: null,
  groupStudyName: null,
  groupDisorderId: null,
  groupDisorderName: null,
  studyId: null,
  studyName: null
}

const useActivities = () => {
  const userData = useUserContext()
  const { t } = useTranslations()

  // HELPERS
  // Using method below tou can check if document by ref exists
  const existsActivity = async ({ id }) => {
    if (!id) {
      return
    }
    const snapshot = await firebase
      .firestore()
      .collection(ACTIVITIES_MODEL_NAME)
      .doc(id)
      .get()
    return !!snapshot.data()
  }

  // Create method helps to create record with or without id generation
  const createActivity = async (data) => {
    if (!data) {
      return
    }
    const _id = firebase.firestore().collection(ACTIVITIES_MODEL_NAME).doc().id
    const fullData = {
      _id,
      _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      _createdBy: userData?._id,
      _isUpdated: false,
      _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      _updatedBy: userData?._id,
      ...data,
      additionalData: {
        ...possibleAdditionalDataFields,
        ...data?.additionalData
      }
    }

    const result = await firebase
      .firestore()
      .collection(ACTIVITIES_MODEL_NAME)
      .doc(_id)
      .set(fullData)

    return result
  }

  //Generate activity text with translations according to activity type
  const getActivityTextByType = (data, type, isTriggeredByAdmin) => {
    const triggeredByTextData = `${
      isTriggeredByAdmin ? t('Admin') : t('Therapist')
    }, ${data?.adminDisplayName || data?.therapistDisplayName}`
    const patientDisplayName = `${data?.groupName} ${data?.groupClinicName} ${t(
      'Patient'
    )} ${data?.patientId}`

    const ACTIVITY_TEXT_BY_TYPE = {
      [CREATE_GROUP]: `${triggeredByTextData}, ${t('created group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [ACTIVATE_GROUP]: `${triggeredByTextData}, ${t('activated group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [EDIT_GROUP]: `${triggeredByTextData}, ${t('edited group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [REMOVE_GROUP]: `${triggeredByTextData}, ${t('removed group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [ADD_THERAPIST_TO_GROUP]: `${triggeredByTextData}, ${t(
        'added therapist'
      )}, ${data?.invitedTherapistDisplayName}, ${t('to group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [ADD_PATIENT_TO_GROUP]: `${triggeredByTextData}, ${t(
        'added patient'
      )}, ${patientDisplayName}, ${t('to group')}, ${t('Week')} ${
        data?.groupName
      }`,
      [REMOVE_THERAPIST_FROM_GROUP]: `${triggeredByTextData}, ${t(
        'removed therapist'
      )}, ${data?.removedTherapistDisplayName}, ${t('from group')}, ${t(
        'Week'
      )} ${data?.groupName}`,
      [REMOVE_PATIENT_FROM_GROUP]: `${triggeredByTextData}, ${t(
        'removed patient'
      )}, ${patientDisplayName}, ${t('from group')}, ${t('Week')} ${
        data?.groupName
      }`,
      [DELIVER_BIO]: `${triggeredByTextData}, ${t(
        'delivered bio for the patient'
      )}, ${patientDisplayName}, ${t('in group')}, ${t('Week')} ${
        data?.groupName
      }`,
      [SET_THREE_MONTH_DATE]: `${triggeredByTextData}, ${t(
        'set three month date for the patient'
      )}, ${patientDisplayName}, ${t('in group')}, ${t('Week')} ${
        data?.groupName
      }`,
      [CHANGE_CLINIC_BIOFLOW_ACCESS]: `${triggeredByTextData}, ${t(
        `${
          data?.clinicBioflowAccess ? 'enabled' : 'disabled'
        } bioflow access for clinic`
      )}, ${data?.clinicName}`,
      [INVITE_THERAPIST]: `${triggeredByTextData}, ${t('invited therapist')}, ${
        data?.invitedTherapistDisplayName
      }, ${t('to bioflow system')}`,
      [REMOVE_THERAPIST]: `${triggeredByTextData}, ${t('removed therapist')}, ${
        data?.removedTherapistDisplayName
      }, ${t('from bioflow system')}`,
      [REMOVE_THERAPIST_INVITE]: `${triggeredByTextData}, ${t(
        'removed invite therapist'
      )}, ${data?.removedTherapistDisplayName}, ${t('from bioflow system')}`,
      [CREATE_STUDY]: `${triggeredByTextData}, ${t('created study')}, ${
        data?.studyName
      }`,
      [EDIT_STUDY]: `${triggeredByTextData}, ${t('edited study')}, ${
        data?.studyName
      }`,
      [REMOVE_STUDY]: `${triggeredByTextData}, ${t('removed study')}, ${
        data?.studyName
      }`
    }

    return ACTIVITY_TEXT_BY_TYPE?.[type]
  }

  // Using method remove you can remove record or field
  const removeActivity = async ({ id }) => {
    if (!id) {
      return
    }
    const entityExists = await existsActivity({ id })
    const result =
      entityExists &&
      (await firebase
        .firestore()
        .collection(ACTIVITIES_MODEL_NAME)
        .doc(id)
        .remove())

    return result
  }

  return {
    existsActivity,
    createActivity,
    getActivityTextByType,
    removeActivity
  }
}

export default useActivities
