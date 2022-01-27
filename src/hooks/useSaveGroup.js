import { notification } from 'antd'
import { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } from 'app/constants/models'
import { useTranslations } from '@qonsoll/translation'
import { useSaveData } from 'app/hooks'
import {
  GROUPS_MODEL_NAME,
  STUDIES_MODEL_NAME
} from 'bioflow/constants/collections'
import THERAPIST_ROLES from 'bioflow/constants/therapistRoles'
import firebase from 'firebase'
import _ from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const generatePatients = async (groupData) => {
  let clinicName, disorderName, studyName
  try {
    const clinicSnapshot =
      groupData.clinicId &&
      (await firebase
        .firestore()
        .collection(CLINICS_MODEL_NAME)
        .doc(groupData.clinicId)
        .get())
    clinicName = clinicSnapshot?.data()?.name || null
    const disorderSnapshot =
      groupData.disorderId &&
      (await firebase
        .firestore()
        .collection(DISORDERS_MODEL_NAME)
        .doc(groupData.disorderId)
        .get())
    disorderName = disorderSnapshot?.data()?.name || null
    const studySnapshot =
      groupData.studyId &&
      (await firebase
        .firestore()
        .collection(STUDIES_MODEL_NAME)
        .doc(groupData.studyId)
        .get())
    studyName = studySnapshot?.data()?.name || null
  } catch (e) {
    console.log('error in patient generate', e)
  }

  return groupData.patients.map((data) => ({
    threeMonthDay: null,
    firstDayBIOCollected: false,
    fourthDayBIOCollected: false,
    threeMonthDayBIOCollected: false,
    ...data,
    clinicName,
    disorderName,
    studyName
  }))
}

const useSaveGroup = () => {
  const { id } = useParams()
  const { save, update } = useSaveData()
  const { t } = useTranslations()

  const errorBoundary = (callback) => async (args) => {
    const { form, data: formData } = args
    const data = formData || form.getFieldsValue()

    if (!data.patients.length) {
      notification.error({
        message: t(
          'Error, You need to add at least one patient in form to activate it.'
        )
      })
      throw new Error('no patients')
    }

    const isAllRoleAvailable = Object.values(data.therapists).map((role) =>
      [
        THERAPIST_ROLES.DEPUTY_VICE_LEADER,
        THERAPIST_ROLES.GROUP_LEADER
      ].includes(role)
    )

    const isAllTherapistAdded =
      isAllRoleAvailable.length >= 2 &&
      isAllRoleAvailable.reduce(
        (acc, value) => (value === true ? ++acc : acc),
        0
      ) === 2

    if (
      data.clinicId &&
      Object.keys(data.therapists)?.length &&
      isAllTherapistAdded &&
      data.patients?.length
    ) {
      try {
        await callback({ ...args, data })
      } catch (e) {
        console.log('error in update function', e)
        notification.error({ message: t('Error occurred on group save') })
      }
    } else {
      notification.warn({
        message: isAllTherapistAdded
          ? t(
              'Need at least one therapist and one patient in group to activate it'
            )
          : t('Group should have Admin, Leader and Vice leader therapists')
      })
      throw new Error('no therapist')
    }
  }

  const normalizeData = async ({ data, status }) => {
    const weekNumber = moment(data.firstDay).week()
    const patients = await generatePatients(data)

    return _.omitBy(
      {
        ...data,
        patients,
        weekNumber,
        firstDay: firebase.firestore.Timestamp.fromDate(
          new Date(data.firstDay)
        ),
        fourthDay: firebase.firestore.Timestamp.fromDate(
          new Date(data.fourthDay)
        ),
        status
      },
      _.isNil
    )
  }

  const updateDataWithStatus = errorBoundary(async (args) => {
    const data = await normalizeData(args)
    await update({
      collection: GROUPS_MODEL_NAME,
      id,
      data,
      withNotification: true
    })
    await firebase.functions().httpsCallable('sendInviteNotifications')({
      groupId: id
    })
  })
  const saveDataWithStatus = errorBoundary(async (args) => {
    const data = await normalizeData(args)
    await save({
      collection: GROUPS_MODEL_NAME,
      data,
      id: data._id,
      withNotification: true
    })

    await firebase.functions().httpsCallable('sendInviteNotifications')({
      groupId: data._id
    })
  })

  return { updateDataWithStatus, saveDataWithStatus }
}

export default useSaveGroup
