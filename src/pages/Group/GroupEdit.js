import { Form } from 'antd'
import { CLINICS_MODEL_NAME } from 'app/constants/models'
import { useUserContext } from 'app/domains/User/contexts'
import { FUTURE_STATUS, ONGOING_STATUS } from 'bioflow/constants/groupStatuses'
import { useSaveGroup } from 'bioflow/hooks'
import React, { useMemo, useState } from 'react'
import moment from 'moment'
import firebase from 'firebase'
import { useTranslations } from '@qonsoll/translation'
import { useHistory, useParams } from 'react-router-dom'
import {
  useDocumentData,
  useDocumentDataOnce
} from 'react-firebase-hooks/firestore'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'
import {
  GROUPS_MODEL_NAME,
  STUDIES_MODEL_NAME,
  THERAPISTS_PROFILE_MODEL_NAME
} from 'bioflow/constants/collections'

function GroupEdit() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { id } = useParams()
  const { updateDataWithStatus } = useSaveGroup()
  const [form] = Form.useForm()
  const { clinics, bioflowTherapistProfileId } = useUserContext()

  // [DATA_FETCH]
  const [groupData] = useDocumentData(
    firebase.firestore().collection(GROUPS_MODEL_NAME).doc(id)
  )
  const [therapistProfile] = useDocumentDataOnce(
    bioflowTherapistProfileId &&
      firebase
        .firestore()
        .collection(THERAPISTS_PROFILE_MODEL_NAME)
        .doc(bioflowTherapistProfileId)
  )

  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)

  const initialValues = useMemo(() => {
    const data = groupData

    if (groupData?.startDay) {
      initialValues.startDay = moment(groupData?.startDay?.toDate?.()).format(
        'YYYY-MM-DD'
      )
    }
    if (groupData?.fourthDay) {
      initialValues.fourthDay = moment(groupData?.fourthDay?.toDate?.()).format(
        'YYYY-MM-DD'
      )
    }
    return data
  }, [groupData])

  // [COMPUTED_PROPERTIES]
  const submitText = useMemo(
    () =>
      !(
        groupData?.clinicId &&
        Object.keys(groupData?.therapists)?.length &&
        groupData?.patients?.length
      ) && t('Save'),
    [groupData]
  ) // If group has all necessary fields it can be "activated"

  // [CLEAN_FUNCTIONS]
  const onFinish = async (data) => {
    setLoading(true)
    const status = moment(data.startDay).isSame(moment(), 'week')

    await updateDataWithStatus({
      data,
      status: status ? ONGOING_STATUS : FUTURE_STATUS
    })

    history.goBack()

    setLoading(false)
  }

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Edit group'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <Row noGutters h="center">
        <Col cw={[12, 8, 8, 6]}>
          {groupData && (
            <GroupSimpleForm
              initialValues={initialValues}
              form={form}
              submitText={submitText}
              onFinish={onFinish}
              loading={loading}
              id={id}
              clinicQuery={
                clinics &&
                Object.keys(clinics).length &&
                firebase
                  .firestore()
                  .collection(CLINICS_MODEL_NAME)
                  .where('_id', 'in', Object.keys(clinics))
              }
              studyQuery={
                therapistProfile &&
                firebase
                  .firestore()
                  .collection(STUDIES_MODEL_NAME)
                  .where('_id', 'in', therapistProfile.studies)
              }
            />
          )}
        </Col>
      </Row>
    </PageWrapper>
  )
}

export default GroupEdit
