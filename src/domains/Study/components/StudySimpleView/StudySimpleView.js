import { CheckOutlined } from '@ant-design/icons'
import { useTranslations } from '@qonsoll/translation'
import { useSaveData } from 'app/hooks'
import {
  STUDIES_MODEL_NAME,
  GROUPS_MODEL_NAME,
  THERAPISTS_PROFILE_MODEL_NAME
} from 'bioflow/constants/collections'
import React, { useMemo, useState } from 'react'
import { Box, Card, Input, Text } from '@qonsoll/react-design'
import { notification, Tooltip } from 'antd'
import { EditRemove } from 'app/components'
import { EDIT_STUDY, REMOVE_STUDY } from 'bioflow/constants/activitiesTypes'
import { useUserContext } from 'app/domains/User/contexts'
import { useActivities } from 'bioflow/hooks'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'

function StudySimpleView(props) {
  const { name, _id } = props

  // [ADDITIONAL_HOOKS]
  const { save, remove } = useSaveData()
  const { t } = useTranslations()
  const { createActivity } = useActivities()
  const { firstName, lastName, email: adminEmail } = useUserContext()

  const [studyGroups] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(GROUPS_MODEL_NAME)
      .where('studyId', '==', _id)
  )

  const [studyTherapists] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(THERAPISTS_PROFILE_MODEL_NAME)
      .where('studies', 'array-contains', _id)
  )

  // [COMPONENT_STATE_HOOKS]
  const [isEdit, setIsEdit] = useState(false)
  const [newName, setNewName] = useState(name)

  const isStudyInUse = useMemo(
    () => !!studyGroups?.length || studyTherapists?.length,
    [studyGroups, studyTherapists]
  )

  // [CLEAN FUNCTIONS]
  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
    } else {
      if (newName && name !== newName) {
        await save({
          collection: STUDIES_MODEL_NAME,
          id: _id,
          data: { name: newName },
          withNotification: true
        })
        createActivity({
          isTriggeredByAdmin: true,
          type: EDIT_STUDY,
          additionalData: {
            adminDisplayName: `${firstName} ${lastName}`,
            adminEmail,
            studyName: name
          }
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
    await remove({ collection: STUDIES_MODEL_NAME, id: _id })
    createActivity({
      isTriggeredByAdmin: true,
      type: REMOVE_STUDY,
      additionalData: {
        adminDisplayName: `${firstName} ${lastName}`,
        adminEmail,
        studyName: name
      }
    })
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
            removeDisabled={isStudyInUse}
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
