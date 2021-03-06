import { Form } from 'antd'
import { CLINICS_MODEL_NAME } from 'app/constants/models'
import { useUserContext } from 'app/domains/User/contexts'
import {
  STUDIES_MODEL_NAME,
  THERAPISTS_PROFILE_MODEL_NAME
} from 'bioflow/constants/collections'
import { ONGOING_STATUS, FUTURE_STATUS } from 'bioflow/constants/groupStatuses'
import firebase from 'firebase'
import moment from 'moment'
import { useBioflowAccess, useSaveGroup } from 'bioflow/hooks'
import React, { useEffect, useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'

function GroupCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const { clinics, bioflowTherapistProfileId } = useUserContext()
  const { isTherapist } = useBioflowAccess()
  const { saveDataWithStatus } = useSaveGroup()

  const [therapistProfile] = useDocumentDataOnce(
    bioflowTherapistProfileId &&
      firebase
        .firestore()
        .collection(THERAPISTS_PROFILE_MODEL_NAME)
        .doc(bioflowTherapistProfileId)
  )
  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  const [initialState, setInitialState] = useState()

  // [CLEAN_FUNCTIONS]
  const onFinish = async (data) => {
    setLoading(true)

    const status = moment(data.firstDay).isSame(moment(), 'week')

    try {
      await saveDataWithStatus({
        data,
        status: status ? ONGOING_STATUS : FUTURE_STATUS,
        isActivate: true
      })

      history.goBack()
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    therapistProfile &&
      setInitialState({
        studyId: therapistProfile.studies[0]
      })
  }, [therapistProfile])

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Create group'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <Row noGutters h="center">
        <Col cw={[12, 8, 8, 6]}>
          <GroupSimpleForm
            initialValues={isTherapist && initialState}
            loading={loading}
            onFinish={onFinish}
            form={form}
            clinicQuery={
              clinics &&
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
        </Col>
      </Row>
    </PageWrapper>
  )
}

GroupCreate.propTypes = {}

export default GroupCreate
