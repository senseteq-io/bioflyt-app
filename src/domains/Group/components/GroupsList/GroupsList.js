import { useUserContext } from 'app/domains/User/contexts'
import {
  DRAFT_STATUS,
  FINISHED_STATUS,
  FUTURE_STATUS,
  ONGOING_STATUS
} from 'bioflow/constants/groupStatuses'
import React, { useEffect, useMemo, useState, Fragment } from 'react'
import { Box, NoData, Title } from '@qonsoll/react-design'
import { List } from 'antd'
import { GroupAdvancedView } from 'bioflow/domains/Group/components'
import firebase from 'firebase'
import _ from 'lodash'
import moment from 'moment'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { AddItem } from 'app/components'
import { GROUPS } from 'bioflow/constants/collections'
import { useBioflowAccess } from 'bioflow/hooks'
import {
  BIOFLOW_ADMIN_GROUP_CREATE_PATH,
  BIOFLOW_GROUP_CREATE_PATH
} from 'bioflow/constants/paths'

function GroupsList() {
  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { isAdmin } = useBioflowAccess()
  const { _id: therapistId } = useUserContext()

  const groupCollectionRef = firebase.firestore().collection(GROUPS)

  // [DATA FETCH]
  const [list] = useCollectionData(
    isAdmin
      ? groupCollectionRef
      : groupCollectionRef.where(`therapists.${therapistId}`, '>=', '')
  )

  // [COMPONENT_STATE_HOOKS]
  const [filteredList, setFilteredList] = useState({})

  // [CLEAN_FUNCTIONS]
  const goToCreateGroup = () =>
    history.push(
      isAdmin ? BIOFLOW_ADMIN_GROUP_CREATE_PATH : BIOFLOW_GROUP_CREATE_PATH
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

  // [USE_EFFECTS]
  useEffect(() => {
    if (sortedList) {
      const statuses = _.uniq(sortedList.map(({ status }) => status))
      const buf = {}

      statuses.forEach((status) => {
        buf[status] = _.filter(sortedList, (item) => item.status === status)
      })
      setFilteredList(buf)
    }
  }, [sortedList])
  console.log(filteredList)
  return (
    <Fragment>
      <Box mb={4}>
        <AddItem
          height={120}
          onClick={goToCreateGroup}
          variant="large"
          createText={t('Add group')}
        />
      </Box>
      {!Object.keys(filteredList).length && <NoData />}

      {filteredList[DRAFT_STATUS] && (
        <GroupFilteredList
          status={t('Draft')}
          data={filteredList[DRAFT_STATUS]}
        />
      )}
      {filteredList[ONGOING_STATUS] && (
        <GroupFilteredList
          status={t('Ongoing')}
          data={filteredList[ONGOING_STATUS]}
        />
      )}
      {filteredList[FUTURE_STATUS] && (
        <GroupFilteredList
          status={t('Future')}
          data={filteredList[FUTURE_STATUS]}
        />
      )}
      {filteredList[FINISHED_STATUS] && (
        <GroupFilteredList
          status={t('Finished')}
          data={filteredList[FINISHED_STATUS]}
        />
      )}
    </Fragment>
  )
}

//xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3
const GroupFilteredList = ({ status, data }) => (
  <Box mb={1}>
    <Title level={4} mb={2}>
      {status}
    </Title>
    <List
      grid={{ gutter: [32, 4], column: 1 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={item._id} style={{ width: '100%' }}>
          <GroupAdvancedView {...item} />
        </List.Item>
      )}
    />
  </Box>
)

GroupsList.propTypes = {}

export default GroupsList
