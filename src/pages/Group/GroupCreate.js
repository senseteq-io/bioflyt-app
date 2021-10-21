import { Form } from 'antd'

import { useSaveGroup } from 'bioflow/hooks'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'

function GroupCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const { updateDataWithStatus, saveDataWithStatus } = useSaveGroup()
  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  const [isSave, setIsSave] = useState(false)

  // [CLEAN_FUNCTIONS]
  const onFinish = async (data) => {
    setLoading(true)
    setIsSave(true)

    await saveDataWithStatus({ data, status: 'FUTURE' })

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
