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
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import { useBioflowAccess } from 'bioflow/hooks'
import {
  BIOFLOW_ADMIN_GROUP_CREATE_PATH,
  BIOFLOW_GROUP_CREATE_PATH
} from 'bioflow/constants/paths'
import { GroupFilterDrawer } from '../'

function GroupsList(props) {
  const { isFilterDrawerVisible, setIsFilterDrawerVisible } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { isAdmin } = useBioflowAccess()
  const { _id: therapistId } = useUserContext()

  const groupCollectionRef = firebase.firestore().collection(GROUPS_MODEL_NAME)

  // [DATA FETCH]
  const [list] = useCollectionData(
    isAdmin
      ? groupCollectionRef
      : groupCollectionRef.where(`therapists.${therapistId}`, '>=', '')
  )

  // [COMPONENT_STATE_HOOKS]
  const [filteredList, setFilteredList] = useState({})
  const [filterData, setFilterData] = useState([])

  // [CLEAN_FUNCTIONS]
  const goToCreateGroup = () =>
    history.push(
      isAdmin ? BIOFLOW_ADMIN_GROUP_CREATE_PATH : BIOFLOW_GROUP_CREATE_PATH
    )

  const filterGroup = (group) => {
    //add new field for filtrating
    const groupData = { ...group, numberOfPatients: group?.patients?.length }
    //iterate by every filter field and compare it value with same field in group
    //to filter irrelevant data
    const comparingResults = filterData?.map((item) => {
      const filterField = Object.keys(item)?.[0]
      return item[filterField] === groupData[filterField]
    })
    //if every filter field value matches with group data
    //result will be true else false
    const isAppropriateGroup = comparingResults?.every(
      (result) => result === true
    )

    return isAppropriateGroup
  }

  // [COMPUTED PROPERTIES]
  const filterInitialValues = useMemo(() => {
    if (filterData?.length) {
      //convert array of objects to one object for initial values
      let initialValues = filterData?.reduce(
        (obj, item) => ({
          ...obj,
          [Object.keys(item)]: item[Object.keys(item)]
        }),
        {}
      )
      return initialValues
    }
    return {}
  }, [filterData])

  const sortedList = useMemo(() => {
    return list
      ? list.sort((a, b) =>
          moment
            .unix(b?._createdAt?.seconds)
            .diff(moment.unix(a?._createdAt?.seconds))
        )
      : []
  }, [list])

  const onSubmitFilter = (filterValues) => {
    setFilterData(filterValues)
  }

  // [USE_EFFECTS]
  useEffect(() => {
    if (sortedList) {
      const statuses = _.uniq(sortedList.map(({ status }) => status))
      const buf = {}
      //when filter data exist we compare status and filter data
      //with group data to filter it
      statuses.forEach((status) => {
        buf[status] = _.filter(sortedList, (item) =>
          !!filterData?.length
            ? item.status === status && filterGroup(item)
            : item.status === status
        )
      })
      setFilteredList(buf)
    }
  }, [sortedList, filterData])

  //set actual filter data to storage
  useEffect(() => {
    if (filterData?.length) {
      localStorage.setItem('filterData', JSON.stringify(filterData))
    }
  }, [filterData])

  //on componentDidMount get filter data from storage
  //and if it exist set to state
  useEffect(() => {
    const filterDataFromStorage = JSON.parse(localStorage.getItem('filterData'))
    if (filterDataFromStorage?.length) {
      setFilterData(filterDataFromStorage)
    }
  }, [])

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

      <GroupFilterDrawer
        initialValues={filterInitialValues}
        isFilterDrawerVisible={isFilterDrawerVisible}
        setIsFilterDrawerVisible={setIsFilterDrawerVisible}
        setFilterData={setFilterData}
        onSubmitFilter={onSubmitFilter}
      />
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
