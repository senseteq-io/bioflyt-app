import { CheckOutlined } from '@ant-design/icons'
import { useTranslations } from '@qonsoll/translation'
import { useSaveData } from 'app/hooks'
import { STUDIES } from 'bioflow/constants/collections'
import firebase from 'firebase'
import React, { useState } from 'react'
import { Box, Card, Input, Text } from '@qonsoll/react-design'
import { notification, Tooltip } from 'antd'
import { EditRemove } from 'app/components'

function StudySimpleView(props) {
  const { name, _id } = props

  // [ADDITIONAL_HOOKS]
  const { save } = useSaveData()
  const { t } = useTranslations()

  // [COMPONENT_STATE_HOOKS]
  const [isEdit, setIsEdit] = useState(false)
  const [newName, setNewName] = useState(name)

  // [CLEAN FUNCTIONS]
  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
    } else {
      if (newName && name !== newName) {
        await save({
          collection: STUDIES,
          id: _id,
          data: { name: newName },
          withNotification: true
        })
        setIsEdit(false)
      } else {
        notification.error({
          message: t(
            `New name should contain at least one symbol and don't be the same as previous`
          )
        })
      }
    }
  }
  const handleRemove = async () => {
    await firebase.firestore().collection(STUDIES).doc(_id).delete()
    notification.success({
      message: t(`Study successfully deleted`)
    })
  }

  return (
    <Card
      size="small"
      bordered={false}
      shadowless
      bg="var(--ql-color-dark-t-lighten6)">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}>
        {!isEdit ? (
          <Tooltip title={name}>
            <Text variant="h5" isEllipsis>
              {name}
            </Text>
          </Tooltip>
        ) : (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            mr={2}
          />
        )}
        <Box minWidth="88px">
          <EditRemove
            onEdit={handleEdit}
            editIcon={isEdit && <CheckOutlined />}
            onRemove={handleRemove}
            name={name}
          />
        </Box>
      </Box>
    </Card>
  )
}

StudySimpleView.propTypes = {}

export default StudySimpleView
