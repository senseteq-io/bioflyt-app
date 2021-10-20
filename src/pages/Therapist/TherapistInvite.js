import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { TherapistInviteForm } from 'bioflow/domains/Therapist/components'
import { useHistory } from 'react-router'
import { useTranslations } from '@qonsoll/translation'

function TherapistInvite(props) {
  //[ADDITIONAl HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const goBack = () => {
    history.goBack()
  }

  const handleTherapistInviteFormSubmit = () => {}

  return (
    <PageWrapper
      alignMiddle
      contentWidth={['100%', '80%', '70%', '50%', '40%']}
      onBack={goBack}
      headingProps={{
        title: t('Invite new therapist'),
        titleSize: 2,
        textAlign: 'center',
        marginBottom: 32
      }}>
      <TherapistInviteForm onSubmit={handleTherapistInviteFormSubmit} />
    </PageWrapper>
  )
}

TherapistInvite.propTypes = {}

export default TherapistInvite
