import { Box } from '@qonsoll/react-design'
import { Form, Select } from 'antd'
import { useTranslations } from '@qonsoll/translation'
import THERAPIST_ROLES from 'bioflow/constants/therapistRoles'
import therapistRoles from 'bioflow/constants/therapistRoles'
import _ from 'lodash'
import React from 'react'

const TherapistForm = (props) => {
  const { form, onFinish, loading, value, therapists } = props
  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [HELPER_FUNCTIONS]
  // Interns & Members - unlimited. Admin, Leader, Vice leader - each by 1
  const checkIfRoleAvailable = (roleName) =>
    value
      ? [THERAPIST_ROLES.MEMBER, THERAPIST_ROLES.INTERN].includes(roleName) ||
        !Object.values(value)?.includes(roleName)
      : true

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
          <Select
            placeholder={t('Select role')}
            options={Object.values(therapistRoles)
              .filter(checkIfRoleAvailable)
              .map((role) => ({
                label: t(_.upperFirst(_.lowerCase(role))),
                value: role
              }))}
          />
        </Form.Item>
      </Box>
    </Form>
  )
}

export default TherapistForm
