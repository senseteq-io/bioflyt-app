import { Modal, List, Form } from 'antd'
import { USERS_MODEL_NAME } from 'app/constants/models'
import {
  TherapistForm,
  TherapistAddFormListItem
} from 'bioflow/domains/Therapist/components'
import firebase from 'firebase'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { Button, Col, Row, Title } from '@qonsoll/react-design'
import { PlusOutlined } from '@ant-design/icons'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'

function TherapistAddForm(props) {
  const { clinicId, onChange, value, disabled } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const [form] = Form.useForm()

  // [COMPONENT_STATE_HOOKS]
  const [isModalVisible, setIsModalVisible] = useState(false)

  // [DATA_FETCH]
  const [therapists, loading] = useCollectionDataOnce(
    !disabled &&
      firebase
        .firestore()
        .collection(USERS_MODEL_NAME)
        .where('role', '==', 'THERAPIST')
        .where('clinicId', '==', clinicId)
  )

  // [CLEAN_FUNCTIONS]
  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)
  const onFinish = (data) => {
    onChange?.(value ? [...value, data] : [data])
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
          dataSource={value}
          renderItem={({ therapistId, role }) => (
            <TherapistAddFormListItem
              therapist={therapists.find(({ _id }) => _id === therapistId)}
              role={role}
              value={value}
              therapistId={therapistId}
              onChange={onChange}
            />
          )}
        />
      </Col>
    </Row>
  )
}

TherapistAddForm.propTypes = {}

export default TherapistAddForm
