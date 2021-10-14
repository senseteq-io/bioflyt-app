import React, { useMemo } from 'react'
import firebase from 'firebase'
import moment from 'moment'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useTranslations } from '@qonsoll/translation'
import { Select } from 'antd'
import { useService } from 'bioflyt/contexts/Service'

function ClinicSelect({ placeholder, ...args }) {
  // [ADDITIONAL HOOKS
  const { t } = useTranslations()
  const { CLINICS_MODEL_NAME } = useService()
  // [DATA FETCH]
  const [list = []] = useCollectionData(
    firebase.firestore().collection(CLINICS_MODEL_NAME)
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
    <Select {...args} placeholder={placeholder || t('Clinic')}>
      {sortedList.map(({ name, _id }) => (
        <Select.Option key={_id} value={_id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ClinicSelect
