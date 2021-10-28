import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslations } from '@qonsoll/translation'
import { Modal, List, Form } from 'antd'
import { Button, Col, Row, Title } from '@qonsoll/react-design'
import { useAvailableTherapists } from 'bioflow/hooks'
import {
  TherapistForm,
  TherapistAddFormListItem
} from 'bioflow/domains/Therapist/components'
import { PlusOutlined } from '@ant-design/icons'

function TherapistAddForm(props) {
  const { clinicId, studyId, onChange, value, disabled } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const [therapists, loading] = useAvailableTherapists(
    clinicId,
    studyId,
    disabled
  )

  // [COMPONENT_STATE_HOOKS]
  const [isModalVisible, setIsModalVisible] = useState(false)

  // [CLEAN_FUNCTIONS]
  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)
  const onFinish = (data) => {
    const { therapistId, role } = data
    onChange?.(
      value ? { ...value, [therapistId]: role } : { [therapistId]: role }
    )
    hideModal()
  }

  return (
    <Row noGutters>
      <Col cw={6} v="center">
        <Title level={4}>{t('Therapists')}</Title>
      </Col>
      <Col cw={6} h="right">
        <Button
          icon={<PlusOutlined />}
          onClick={showModal}
          disabled={disabled}
        />
        <Modal
          title={t('Therapists')}
          okText={t('Submit')}
          cancelText={t('Cancel')}
          visible={isModalVisible}
          onCancel={hideModal}
          destroyOnClose
          onOk={form.submit}>
          <TherapistForm
            onFinish={onFinish}
            form={form}
            loading={loading}
            value={value}
            therapists={therapists}
          />
        </Modal>
      </Col>
      <Col cw={12}>
        <List
          itemLayout="horizontal"
          dataSource={value && Object.keys(value)}
          renderItem={(therapistId) => (
            <TherapistAddFormListItem
              therapist={therapists?.find(({ _id }) => _id === therapistId)}
              role={value[therapistId]}
              value={value}
              therapistId={therapistId}
              onChange={onChange}
              loading={loading}
            />
          )}
        />
      </Col>
    </Row>
  )
}

TherapistAddForm.propTypes = {
  clinicId: PropTypes.string.isRequired,
  studyId: PropTypes.string.isRequired
}

export default TherapistAddForm
