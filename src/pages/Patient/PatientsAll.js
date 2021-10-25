import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper } from '@qonsoll/react-design'
import { PatientsList } from 'bioflow/domains/Patient/components'

function PatientsAll() {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  return (
    <PageWrapper
      headingProps={{
        title: t('Patients'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <PatientsList />
    </PageWrapper>
  )
}

export default PatientsAll
