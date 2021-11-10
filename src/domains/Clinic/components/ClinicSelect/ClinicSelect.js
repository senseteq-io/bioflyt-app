import React, { useMemo } from 'react'
import firebase from 'firebase'
import moment from 'moment'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useTranslations } from '@qonsoll/translation'
import { Select } from 'antd'
import { CLINICS_MODEL_NAME } from 'app/constants/models'

function ClinicSelect({ placeholder, query, ...args }) {
  // [ADDITIONAL HOOKS
  const { t } = useTranslations()
  // [DATA FETCH]
  const [list = [], loading] = useCollectionData(
    query || firebase.firestore().collection(CLINICS_MODEL_NAME)
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
    <Select
      {...args}
      placeholder={placeholder || t('Clinic')}
      loading={loading}>
      {sortedList.map(({ name, _id }) => (
        <Select.Option key={_id} value={_id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ClinicSelect
