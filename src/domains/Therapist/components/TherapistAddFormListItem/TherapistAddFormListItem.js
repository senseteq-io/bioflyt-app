import { Card, Col, Remove, Row, Text } from '@qonsoll/react-design'
import { List, Select } from 'antd'
import { useTranslations } from '@qonsoll/translation'
import therapistRoles from 'bioflow/constants/therapistRoles'
import _ from 'lodash'
import React from 'react'

const TherapistAddFormListItem = (props) => {
  const { therapist, therapistId, value, role, onChange } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [CLEAN_FUNCTIONS]
  const changeRole = (newRole) => {
    const index = value.findIndex(({ therapistId: id }) => id === therapistId)
    value[index].role = newRole
    onChange?.(value)
  }
  const removeTherapist = () =>
    onChange(value.filter(({ therapistId: id }) => id !== therapistId))

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
              {therapist?.firstName} {therapist?.lastName}
            </Text>
          </Col>
          <Col mb={2} h="right">
            <Remove icon onSubmit={removeTherapist} type="text" />
          </Col>
          <Col cw={12} h="right">
            <Select
              defaultValue={role}
              onChange={changeRole}
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
}

TherapistAddFormListItem.propTypes = {}

export default TherapistAddFormListItem
