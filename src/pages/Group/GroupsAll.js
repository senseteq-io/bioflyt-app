import { Button, Container, PageWrapper } from '@qonsoll/react-design'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { GroupsList } from 'bioflow/domains/Group/components'
import { FilterOutlined } from '@ant-design/icons'

function GroupsAll(props) {
  const { inTab, isDrawerVisible, setIsDrawerVisible } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false)

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

  const onOpenFilterDrawer = () => {
    setIsFilterDrawerVisible(true)
  }

  return (
    <PageWrapper
      headingProps={{
        title: t('Groups'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}
      action={
        <Button
          icon={<FilterOutlined />}
          type="primary"
          onClick={onOpenFilterDrawer}>
          {t('Filter')}
        </Button>
      }>
      <GroupsList
        isFilterDrawerVisible={isFilterDrawerVisible}
        setIsFilterDrawerVisible={setIsFilterDrawerVisible}
      />
    </PageWrapper>
  )
}

GroupsAll.propTypes = {}

export default GroupsAll
