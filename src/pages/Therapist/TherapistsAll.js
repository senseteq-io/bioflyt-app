import React from 'react'
import { Container } from '@qonsoll/react-design'
import { TherapistsList } from 'bioflow/domains/Therapist/components'

function TherapistsAll(props) {
  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  return (
    <Container mt={4}>
      <TherapistsList />
    </Container>
  )
}

TherapistsAll.propTypes = {}

export default TherapistsAll
