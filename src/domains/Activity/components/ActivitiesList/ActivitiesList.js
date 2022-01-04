import React from 'react'
import { ListWithCreate } from 'app/components'
import { ActivitySimpleView } from '..'

function ActivitiesList(props) {
  const { dataSource } = props
  return (
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
      dataSource={dataSource}
      withCreate={false}>
      <ActivitySimpleView />
    </ListWithCreate>
  )
}

ActivitiesList.propTypes = {}

export default ActivitiesList
