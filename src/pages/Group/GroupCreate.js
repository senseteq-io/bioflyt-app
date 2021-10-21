import { Form, notification } from 'antd'
import { useSaveData } from 'app/hooks'
import { GROUPS } from 'bioflow/constants/collections'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'
import firebase from 'firebase/app'
import _ from 'lodash'

function GroupCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const { save } = useSaveData()
  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)

  // [CLEAN_FUNCTIONS]
  const onFinish = async (data) => {
    setLoading(true)
    console.log(data)
    setLoading(false)
  }

  useEffect(
    () => () => {
      const saveDraft = async () => {
        const data = form.getFieldsValue()

        if (data.clinicId && data.therapists.length && data.patients.length) {
          try {
            const weekNumber = moment(data.startDay).week()

            await save({
              collection: GROUPS,
              data: _.omitBy(
                {
                  ...data,
                  weekNumber,
                  startDay: firebase.firestore.Timestamp.fromDate(
                    new Date(data.startDay)
                  ),
                  endDay: firebase.firestore.Timestamp.fromDate(
                    new Date(data.endDay)
                  ),
                  status: 'DRAFT'
                },
                _.isNil
              ),
              withNotification: true
            })
          } catch (e) {
            console.log(e)
            notification.error({ message: t('Error occurred on group save') })
          }
        }
      }
      saveDraft()
    },
    []
  )

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
          <GroupSimpleForm loading={loading} onFinish={onFinish} form={form} />
        </Col>
      </Row>
    </PageWrapper>
  )
}

GroupCreate.propTypes = {}

export default GroupCreate
