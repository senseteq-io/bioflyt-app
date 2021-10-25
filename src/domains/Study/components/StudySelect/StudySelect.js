import React, { useMemo } from 'react'
import firebase from 'firebase'
import moment from 'moment'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useTranslations } from '@qonsoll/translation'
import { Select } from 'antd'
import { STUDIES } from 'bioflow/constants/collections'

function StudySelect({ placeholder, ...args }) {
  // [ADDITIONAL HOOKS
  const { t } = useTranslations()
  // [DATA FETCH]
  const [list = []] = useCollectionData(
    firebase.firestore().collection(STUDIES)
  )

  // [COMPUTED PROPERTIES]
  const sortedList = useMemo(() => {
    return list
      ? list.sort((a, b) =>
          moment
            .unix(b?._createdAt?.seconds)
            .diff(moment.unix(a?._createdAt?.seconds))
        )
      : []
  }, [list])

  return (
    <Select {...args} placeholder={placeholder || t('Study')}>
      {sortedList.map(({ name, _id }) => (
        <Select.Option key={_id} value={_id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default StudySelect
