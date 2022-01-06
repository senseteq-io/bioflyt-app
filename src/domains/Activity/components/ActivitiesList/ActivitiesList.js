import React, { Fragment } from 'react'
import { ListWithCreate } from 'app/components'
import { ActivitySimpleView } from '../'
import { Box, NoData, Title } from '@qonsoll/react-design'
import moment from 'moment'

function ActivitiesList(props) {
  const { dataSource } = props

  // [COMPUTED PROPERTIES]
  const actionsDates = dataSource?.map(({ _createdAt }) =>
    moment(_createdAt.toDate?.()).format('DD.MM.YYYY')
  )

  const uniqueDates = actionsDates?.filter(
    (day, index, self) => self.indexOf(day) === index
  )

  if (!uniqueDates?.length) {
    return (
      <Box>
        <NoData />
      </Box>
    )
  }

  return (
    <Fragment>
      {uniqueDates?.map((date) => (
        <Fragment>
          <Box my={3}>
            <Title type="secondary" level={5}>
              {date}
            </Title>
          </Box>
          <ListWithCreate
            grid={{
              gutter: [32, 8],
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 1
            }}
            dataSource={dataSource?.filter(
              (activity) =>
                moment(activity._createdAt.toDate?.()).format('DD.MM.YYYY') ===
                date
            )}
            withCreate={false}>
            <ActivitySimpleView />
          </ListWithCreate>
        </Fragment>
      ))}
    </Fragment>
  )
}

ActivitiesList.propTypes = {}

export default ActivitiesList
