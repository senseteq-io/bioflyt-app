import { Container, PageWrapper } from '@qonsoll/react-design'
import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { GroupsList } from 'bioflow/domains/Group/components'

function GroupsAll(props) {
  const { inTab } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  if (inTab) {
    return (
      <Container mt={4}>
        <GroupsList />
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
      }}>
      <GroupsList />
    </PageWrapper>
  )
}

GroupsAll.propTypes = {}

export default GroupsAll
