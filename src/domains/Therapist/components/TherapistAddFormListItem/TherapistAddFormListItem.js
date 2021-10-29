import THERAPIST_ROLES from 'bioflow/constants/therapistRoles'
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useTranslations } from '@qonsoll/translation'
import { List, Select } from 'antd'
import { Card, Col, Remove, Row, Text } from '@qonsoll/react-design'
import { useUserContext } from 'app/domains/User/contexts'
import therapistRoles from 'bioflow/constants/therapistRoles'

const TherapistAddFormListItem = (props) => {
  const { therapist, therapistId, value, role, onChange, loading } = props

  // [ADDITIONAL_HOOKS]
  const { _id } = useUserContext()
  const { t } = useTranslations()

  // [CLEAN_FUNCTIONS]
  const changeRole = (newRole) => {
    const newValue = { ...value }
    newValue[therapistId] = newRole
    onChange?.(newValue)
  }
  const removeTherapist = () => {
    const newValue = { ...value }
    delete newValue[therapistId]
    onChange(newValue)
  }

  /*
   * Interns & Members - unlimited. Admin, Leader, Vice leader - each by 1
   * don't remove item with current therapist role to correct select work.
   */
  const checkIfRoleAvailable = (roleName) =>
    value
      ? [
          THERAPIST_ROLES.MEMBER,
          THERAPIST_ROLES.INTERN,
          value[therapistId]
        ].includes(roleName) || !Object.values(value)?.includes(roleName)
      : true

  return (
    <List.Item>
      <Card
        size="small"
        bordered={false}
        shadowless
        bg="var(--ql-color-dark-t-lighten6)"
        width="100%">
        <Row v="center" negativeBlockMargin>
          <Col cw="auto" mb={2}>
            <Text>
              {loading
                ? `${t('Loading')}...`
                : `${therapist?.firstName} ${therapist?.lastName}`}
            </Text>
          </Col>
          <Col mb={2} h="right">
            {therapistId !== _id && (
              <Remove icon onSubmit={removeTherapist} type="text" />
            )}
          </Col>
          <Col cw={12} h="right">
            <Select
              defaultValue={role}
              onChange={changeRole}
              placeholder={t('Select role')}
              options={Object.values(therapistRoles)
                .filter(checkIfRoleAvailable)
                .map((role) => ({
                  label: t(_.upperFirst(_.lowerCase(role))),
                  value: role
                }))}
            />
          </Col>
        </Row>
      </Card>
    </List.Item>
  )
}

TherapistAddFormListItem.propTypes = {
  therapist: PropTypes.array,
  therapistId: PropTypes.string,
  value: PropTypes.object,
  role: PropTypes.string,
  onChange: PropTypes.func
}

export default memo(TherapistAddFormListItem)
