import { notification } from 'antd'
import { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } from 'app/constants/models'
import { useTranslations } from '@qonsoll/translation'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import {
  GROUPS_MODEL_NAME,
  ACTIVITIES_MODEL_NAME
} from 'bioflow/constants/collections'
import {
  DRAFT_STATUS,
  FUTURE_STATUS,
  ONGOING_STATUS
} from 'bioflow/constants/groupStatuses'
import firebase from 'firebase'
import _ from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const generatePatients = async (data, weekNumber) => {
  let clinicData, disorderData
  try {
    const clinicSnapshot =
      data.clinicId &&
      (await firebase
        .firestore()
        .collection(CLINICS_MODEL_NAME)
        .doc(data.clinicId)
        .get())
    clinicData = clinicSnapshot?.data()
    const disorderSnapshot =
      data.disorderId &&
      (await firebase
        .firestore()
        .collection(DISORDERS_MODEL_NAME)
        .doc(data.disorderId)
        .get())
    disorderData = disorderSnapshot?.data()
  } catch (e) {
    console.log('error in patient generate', e)
  }

  return data.patients.map((data) => ({
    ...data,
    generated: `${weekNumber}${clinicData?.name || ''}${
      disorderData?.name || ''
    }${data.initial.toUpperCase()}`.replaceAll('', ''),
    initial: data.initial
  }))
}

const useSaveGroup = () => {
  const { id } = useParams()
  const { firstName, lastName, role } = useUserContext()
  const { save, update } = useSaveData()
  const { t } = useTranslations()

  const errorBoundary = (callback) => async (args) => {
    const { form, data: formData } = args
    const data = formData || form.getFieldsValue()

    if (
      data.clinicId &&
      Object.keys(data.therapists)?.length &&
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
        message: t(
          'Need at least one therapist and one patient in group to activate it'
        )
      })
    }
  }

  const normalizeData = async ({ data, status }) => {
    const weekNumber = moment(data.startDay).week()
    for (const { initial } of data.patients) {
      if (initial === '') return
    }

    const patients = await generatePatients(data, weekNumber)

    return _.omitBy(
      {
        ...data,
        patients,
        weekNumber,
        startDay: firebase.firestore.Timestamp.fromDate(
          new Date(data.startDay)
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
    const messages = {
      [DRAFT_STATUS]: 'Group was changed and save as a draft by',
      ACTIVATE: 'Group was activated by',
      [ONGOING_STATUS]: 'Group was changed by',
      [FUTURE_STATUS]: 'Group was changed by'
    }
    await save({
      collection: ACTIVITIES_MODEL_NAME,
      data: {
        groupId: id,
        clinicId: args.data.clinicId,
        text: `${t(messages[args.status])} ${firstName} ${lastName}`
      }
    })
  })
  const saveDataWithStatus = errorBoundary(async (args) => {
    const data = await normalizeData(args)
    const groupId = await save({
      collection: GROUPS_MODEL_NAME,
      data,
      withNotification: true
    })

    const messages = {
      [DRAFT_STATUS]: 'Group was saved as a draft by',
      [ONGOING_STATUS]: 'Group was created by'
      // [FUTURE_STATUS]: 'Group was finished by'
    }
    await save({
      collection: ACTIVITIES_MODEL_NAME,
      data: {
        groupId,
        clinicId: args.data.clinicId,
        text: `${t(
          args.isActivate ? 'Group was activated by' : messages[args.status]
        )} ${_.lowerCase(role)} ${firstName} ${lastName}`
      }
    })
  })

  return { updateDataWithStatus, saveDataWithStatus }
}

export default useSaveGroup
