import React, { Fragment } from 'react'
import {
  Button,
  Box,
  Title,
  Text,
  Dropdown,
  Menu,
  MenuItem,
  NoData
} from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { UserCard } from 'app/domains/User/components'
import { Tooltip } from 'antd'
import { MailOutlined, TeamOutlined } from '@ant-design/icons'

function TherapistSimpleView(props) {
  const { firstName, lastName, email, groups, avatarUrl } = props
  // const { ADDITIONAL_DESTRUCTURING_HERE } = user

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  // [COMPUTED PROPERTIES]
  const displayName = `${firstName} ${lastName}`

  // [CLEAN FUNCTIONS]

  const groupList = (
    <Menu>
      {groups?.length ? (
        groups.map((group) => (
          <MenuItem>
            <Text type="secondary">
              {t('Group')}: {group?.name}
            </Text>
          </MenuItem>
        ))
      ) : (
        <MenuItem>
          <NoData />
        </MenuItem>
      )}
    </Menu>
  )

  return (
    <UserCard
      avatarUrl={avatarUrl}
      actions={
        <Fragment>
          <Box mb={2}>
            <Tooltip title={t('Therapist groups')}>
              <Dropdown overlay={groupList} placement="bottomRight" arrow>
                <Button variant="white" icon={<TeamOutlined />} />
              </Dropdown>
            </Tooltip>
          </Box>
          <Box mb={2}>
            <Tooltip title={email}>
              <Button
                variant="white"
                icon={<MailOutlined />}
                href={`mailto:${email}`}
              />
            </Tooltip>
          </Box>
        </Fragment>
      }>
      <Title
        mb={2}
        level={4}
        color="white"
        textShadow="var(--ql-color-black) 1px 0 10px">
        {displayName}
      </Title>
    </UserCard>
  )
}

TherapistSimpleView.propTypes = {}

export default TherapistSimpleView
