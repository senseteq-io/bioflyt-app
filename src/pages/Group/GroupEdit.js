import { useSaveGroup } from 'bioflow/hooks'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import firebase from 'firebase'
import { useTranslations } from '@qonsoll/translation'
import { useHistory, useParams } from 'react-router-dom'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Form } from 'antd'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'
import { GROUPS } from 'bioflow/constants/collections'

function GroupEdit() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { id } = useParams()
  const { updateDataWithStatus } = useSaveGroup()
  const [form] = Form.useForm()

  // [DATA_FETCH]
  const [groupData] = useDocumentDataOnce(
    firebase.firestore().collection(GROUPS).doc(id)
  )

  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  const [isSave, setIsSave] = useState(false)
  const initialValues = groupData && {
    ...groupData,
    startDay: moment(groupData?.startDay?.toDate?.()).format('YYYY-MM-DD'),
    endDay: moment(groupData?.endDay?.toDate?.()).format('YYYY-MM-DD'),
    patients: groupData.patients.map(({ initial }) => initial)
  }

  const onFinish = async (data) => {
    setLoading(true)
    setIsSave(true)
    await updateDataWithStatus({ data, status: 'FUTURE' })

    history.goBack()

    setLoading(false)
  }

  useEffect(
    () => () => !isSave && updateDataWithStatus({ form, status: 'DRAFT' }),
    [isSave]
  )

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
              submitText={t('Save')}
              onFinish={onFinish}
              loading={loading}
            />
          )}
        </Col>
      </Row>
    </PageWrapper>
  )
}

export default GroupEdit
