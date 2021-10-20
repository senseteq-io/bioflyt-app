import React from 'react'
import { Container } from '@qonsoll/react-design'
import { TherapistInviteForm } from 'bioflow/domains/Therapist/components'

function TherapistInvite(props) {
  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  return (
    <Container mt={4}>
      <TherapistInviteForm />
    </Container>
  )
}

TherapistInvite.propTypes = {}

export default TherapistInvite
