import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { InView } from 'react-intersection-observer'
import { message } from 'antd'
import { Box, Spin } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import firebase from 'firebase'

const InfiniteList = (props) => {
  const {
    children,
    initialData,
    limit,
    order,
    idField = '_id',
    collectionName,
    onReachEnd
  } = props

  // [ADDITIONAL_HOOKS]
  const { t } = useTranslations()

  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(initialData)
  const [lastElement, setLastElement] = useState(_.last(initialData))
  const [isEndOfList, setIsEndOfList] = useState(false)

  // [HELPER_FUNCTIONS]
  const handleUpdate = async (isView) => {
    if (isView) {
      !isEndOfList && setLoading(true)
      try {
        // Get new data snapshot
        const res = await firebase
          .firestore()
          .collection(collectionName)
          .orderBy(order.field, order.type ?? 'asc')
          .startAfter(lastElement?.[order.field])
          .limit(limit)
          .get()
        if (!res.size) {
          // If get all collection data
          onReachEnd?.()
          setIsEndOfList(true)

          setLoading(false)
        } else {
          // Transform data snapshot to valid data object
          const resData = res.docs.map((snapshot) => {
            if (idField) {
              return {
                ...snapshot.data(),
                [idField]: snapshot.id
              }
            }
            return snapshot.data()
          })

          // Attach new data to array
          setData((data) => data.concat(resData))
          //get last element to know where to start new query
          setLastElement(_.last(resData))
        }
      } catch (error) {
        console.log(error)
        message.error(t('Error occurred during data fetch'))
      }
    }
  }

  return (
    <Fragment>
      {children(data)}
      <InView as={Box} onChange={handleUpdate}>
        {loading && (
          <Box
            display="flex"
            flex={1}
            justifyContent="center"
            alignItems="center"
            py={2}>
            <Spin />
          </Box>
        )}
      </InView>
    </Fragment>
  )
}

InfiniteList.propTypes = {
  children: PropTypes.func,
  initialData: PropTypes.array,
  collectionName: PropTypes.string.isRequired,
  order: PropTypes.shape({
    field: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['asc', 'desc'])
  }),
  limit: PropTypes.number,
  idField: PropTypes.string,
  onReachEnd: PropTypes.func
}

export default InfiniteList
