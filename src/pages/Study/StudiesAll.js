import React from 'react'
import { Container } from '@qonsoll/react-design'
import { StudyList } from 'bioflow/domains/Study/components'

function StudiesAll() {
  return (
    <Container mt={4}>
      <StudyList />
    </Container>
  )
}

export default StudiesAll
