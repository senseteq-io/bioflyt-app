import { Modal, Select, List, Form } from 'antd'
import { USERS_MODEL_NAME } from 'app/constants/models'
import therapistRoles from 'bioflow/constants/therapistRoles'
import firebase from 'firebase'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import {
  Box,
  Button,
  Card,
  Col,
  Remove,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
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
          onOk={() => {
            form.submit()
          }}>
          <Form form={form} onFinish={onFinish} preserve={false}>
            <Box mb={4}>
              <Form.Item
                name="therapistId"
                rules={[
                  { required: true, message: t('Select therapist, please') }
                ]}>
                <Select
                  placeholder={t('Select therapist')}
                  style={{ width: '100%' }}
                  loading={loading}>
                  {therapists
                    ?.filter(({ _id }) =>
                      value
                        ? !value
                            .map(({ therapistId }) => therapistId)
                            ?.includes(_id)
                        : true
                    )
                    .map(({ _id, firstName, lastName }) => (
                      <Select.Option value={_id} key={_id}>
                        {firstName} {lastName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Box>
            <Box mb={3}>
              <Form.Item
                name="role"
                rules={[{ required: true, message: t('Select role, please') }]}>
                <Select
                  placeholder={t('Select role')}
                  style={{ width: '100%' }}>
                  {Object.values(therapistRoles)
                    ?.filter((roleName) =>
                      value
                        ? !value.map(({ role }) => role)?.includes(roleName)
                        : true
                    )
                    .map((role) => (
                      <Select.Option value={role} key={role}>
                        {_.upperFirst(_.lowerCase(role))}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Box>
          </Form>
        </Modal>
      </Col>
      <Col cw={12}>
        <List
          itemLayout="horizontal"
          dataSource={value}
          renderItem={({ therapistId, role }) => {
            const therapist = therapists.find(({ _id }) => _id === therapistId)
            return (
              <List.Item>
                <Card size="small" width="100%">
                  <Row v="center" negativeBlockMargin>
                    <Col cw="auto" mb={2}>
                      <Text>
                        {therapist.firstName} {therapist.lastName}
                      </Text>
                    </Col>
                    <Col mb={2} h="right">
                      <Remove
                        icon
                        onSubmit={() =>
                          onChange(
                            value.filter(
                              ({ therapistId: id }) => id !== therapistId
                            )
                          )
                        }
                      />
                    </Col>
                    <Col cw={12} h="right">
                      <Select
                        defaultValue={role}
                        onChange={(newRole) => {
                          const index = value.findIndex(
                            ({ therapistId: id }) => id === therapistId
                          )
                          value[index].role = newRole
                          onChange?.(value)
                        }}
                        placeholder={t('Select role')}>
                        {Object.values(therapistRoles).map((role) => (
                          <Select.Option value={role} key={role}>
                            {_.upperFirst(_.lowerCase(role))}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )
          }}
        />
      </Col>
    </Row>
  )
}

TherapistAddForm.propTypes = {}

export default TherapistAddForm
