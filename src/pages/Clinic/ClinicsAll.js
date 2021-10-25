import React from 'react'
import { Container } from '@qonsoll/react-design'
import { ClinicsList } from '../../domains/Clinic/components'

function ClinicsAll(props) {
  return (
    <Container mt={4}>
      <ClinicsList />
    </Container>
  )
}

ClinicsAll.propTypes = {}

export default ClinicsAll
