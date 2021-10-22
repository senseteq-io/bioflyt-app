import { notification } from 'antd'
import { CLINICS_MODEL_NAME, DISORDERS_MODEL_NAME } from 'app/constants/models'
import { useTranslations } from '@qonsoll/translation'
import { useUserContext } from 'app/domains/User/contexts'
import { useSaveData } from 'app/hooks'
import { GROUPS, ACTIVITIES } from 'bioflow/constants/collections'
import firebase from 'firebase'
import _ from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const generatePatients = async (data, weekNumber) => {
  const clinicSnapshot =
    data.clinicId &&
    (await firebase
      .firestore()
      .collection(CLINICS_MODEL_NAME)
      .doc(data.clinicId)
      .get())
  const clinicData = clinicSnapshot?.data()
  const disorderSnapshot =
    data.disorderId &&
    (await firebase
      .firestore()
      .collection(DISORDERS_MODEL_NAME)
      .doc(data.disorderId)
      .get())
  const disorderData = disorderSnapshot?.data()
  return data.patients.map((initials) => ({
    generated: `${weekNumber}${clinicData?.name || ''}${
      disorderData?.name || ''
    }${initials.toUpperCase()}`,
    initial: initials
  }))
}

const useSaveGroup = () => {
  const { id } = useParams()
  const { firstName, lastName } = useUserContext()
  const { save, update } = useSaveData()
  const { t } = useTranslations()
  const updateDataWithStatus = async ({ form, data: formData, status }) => {
    const data = formData || form.getFieldsValue()

    if (data.clinicId && data.therapists?.length && data.patients?.length) {
      try {
        const weekNumber = moment(data.startDay).week()
        for (const initial of data.patients) {
          if (initial === '') return
        }
        const patients = await generatePatients(data, weekNumber)
        await update({
          collection: GROUPS,
          id,
          data: _.omitBy(
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
          ),
          withNotification: true
        })
        const messages = {
          DRAFT: 'Group was changed and save as a draft by',
          FUTURE: 'Group was changed by'
        }
        await save({
          collection: ACTIVITIES,
          data: {
            groupId: id,
            clinicId: data.clinicId,
            text: `${t(messages[status])} ${firstName} ${lastName}`
          }
        })
      } catch (e) {
        console.log(e)
        notification.error({ message: t('Error occurred on group save') })
      }
    }
  }
  const saveDataWithStatus = async ({ form, data: formData, status }) => {
    const data = formData || form.getFieldsValue()

    if (data.clinicId && data.therapists?.length && data.patients?.length) {
      try {
        const weekNumber = moment(data.startDay).week()
        for (const initial of data.patients) {
          if (initial === '') return
        }
        const patients = await generatePatients(data, weekNumber)

        const groupId = await save({
          collection: GROUPS,
          data: _.omitBy(
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
          ),
          withNotification: true
        })

        const messages = {
          DRAFT: 'Group was saved as a draft by',
          FUTURE: 'Group was created by'
        }
        await save({
          collection: ACTIVITIES,
          data: {
            groupId,
            clinicId: data.clinicId,
            text: `${t(messages[status])} ${firstName} ${lastName}`
          }
        })
      } catch (e) {
        console.log(e)
        notification.error({ message: t('Error occurred on group save') })
      }
    }
  }

  return { updateDataWithStatus, saveDataWithStatus }
}

export default useSaveGroup
