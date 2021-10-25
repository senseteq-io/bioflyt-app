import { Form } from 'antd'
import { ONGOING_STATUS, FUTURE_STATUS } from 'bioflow/constants/groupStatuses'
import moment from 'moment'
import { useSaveGroup } from 'bioflow/hooks'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'

function GroupCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const { saveDataWithStatus } = useSaveGroup()
  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)

  // [CLEAN_FUNCTIONS]
  const onFinish = async (data) => {
    setLoading(true)

    const status = moment(data.startDay).isSame(moment(), 'week')

    await saveDataWithStatus({
      data,
      status: status ? ONGOING_STATUS : FUTURE_STATUS,
      isActivate: true
    })

    history.goBack()

    setLoading(false)
  }

  // useEffect(
  //   () => () =>
  //     saveDataWithStatus({
  //       form,
  //       status: 'DRAFT'
  //     }),
  //   []
  // )

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
