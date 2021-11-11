import { BIOFLOW_NOTIFICATIONS_PATH } from 'bioflow/constants/paths'
import React from 'react'
import { Badge } from 'antd'
import { Box, MenuItem } from '@qonsoll/react-design'
import { BellOutlined } from '@ant-design/icons'
import { useNotifications } from 'bioflow/contexts/Notifications'
import { useLocation } from 'react-router-dom'
import theme from 'styles/theme'

const NotificationMenuItem = (props) => {
  const { menuIconStyles, collapse, children, ...rest } = props

  // [ADDITIONAL_HOOKS]
  const { unreadCount } = useNotifications()
  const location = useLocation()
  return (
    <MenuItem
      icon={
        !!unreadCount && collapse ? (
          <Badge count={unreadCount} offset={['-4', 3]}>
            <BellOutlined
              style={{
                color:
                  location.pathname !== BIOFLOW_NOTIFICATIONS_PATH &&
                  theme.color.text.light.secondary,
                ...menuIconStyles?.style
              }}
            />
          </Badge>
        ) : (
          <BellOutlined
            style={{
              color:
                location.pathname !== BIOFLOW_NOTIFICATIONS_PATH &&
                theme.color.text.light.secondary,
              ...menuIconStyles?.style
            }}
          />
        )
      }
      {...rest}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {children}

        {!!unreadCount && !collapse && (
          <Badge count={unreadCount} offset={[0, 0]} />
        )}
      </Box>
    </MenuItem>
  )
}

export default NotificationMenuItem
