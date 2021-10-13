import React from 'react'
import { Box } from '@qonsoll/react-design'
import { ClinicsList } from '../../domains/Clinic/components'

const mainWrapperStyles = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  mt: 4
}
function ClinicsAll(props) {
  return (
    <Box {...mainWrapperStyles}>
      <Box width={['100%', '80%', '70%', '50%', '50%']}>
        <ClinicsList />
      </Box>
    </Box>
  )
}

ClinicsAll.propTypes = {}

export default ClinicsAll
