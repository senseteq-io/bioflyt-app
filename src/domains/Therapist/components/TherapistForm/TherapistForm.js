import { Box } from '@qonsoll/react-design'
import { Form, Select } from 'antd'
import { useTranslations } from '@qonsoll/translation'
import therapistRoles from 'bioflow/constants/therapistRoles'
import _ from 'lodash'
import React from 'react'

const TherapistForm = ({ form, onFinish, loading, value, therapists }) => {
  const { t } = useTranslations()
  return (
    <Form form={form} onFinish={onFinish} preserve={false}>
      <Box mb={4}>
        <Form.Item
          name="therapistId"
          rules={[{ required: true, message: t('Select therapist, please') }]}>
          <Select
            placeholder={t('Select therapist')}
            style={{ width: '100%' }}
            loading={loading}>
            {therapists
              ?.filter(({ _id }) =>
                value ? !Object.keys(value)?.includes(_id) : true
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
          <Select placeholder={t('Select role')} style={{ width: '100%' }}>
            {Object.values(therapistRoles)
              ?.filter((roleName) =>
                value ? !Object.values(value)?.includes(roleName) : true
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
  )
}

TherapistForm.propTypes = {}

export default TherapistForm
