import { Button, Container, PageWrapper } from '@qonsoll/react-design'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { GroupsList } from 'bioflow/domains/Group/components'
import { FilterOutlined } from '@ant-design/icons'
import { Badge } from 'antd'

function GroupsAll(props) {
  const { inTab, isDrawerVisible, setIsDrawerVisible } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false)

  const onOpenFilterDrawer = () => {
    setIsFilterDrawerVisible(true)
  }

  const filterData = JSON.parse(localStorage.getItem('filterData'))?.length

  const action = !!filterData ? (
    <Badge count={filterData} offset={['-4', 3]}>
      <Button
        icon={<FilterOutlined />}
        type="primary"
        onClick={onOpenFilterDrawer}>
        {t('Filter')}
      </Button>
    </Badge>
  ) : (
    <Button
      icon={<FilterOutlined />}
      type="primary"
      onClick={onOpenFilterDrawer}>
      {t('Filter')}
    </Button>
  )

  if (inTab) {
    return (
      <Container mt={4}>
        <GroupsList
          isFilterDrawerVisible={isDrawerVisible}
          setIsFilterDrawerVisible={setIsDrawerVisible}
        />
      </Container>
    )
  }

  return (
    <PageWrapper
      headingProps={{
        title: t('Groups'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}
      action={action}>
      <GroupsList
        isFilterDrawerVisible={isFilterDrawerVisible}
        setIsFilterDrawerVisible={setIsFilterDrawerVisible}
      />
    </PageWrapper>
  )
}

GroupsAll.propTypes = {}

export default GroupsAll
