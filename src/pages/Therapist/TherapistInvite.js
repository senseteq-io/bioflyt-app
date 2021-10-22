import React from 'react'
import { PageWrapper } from '@qonsoll/react-design'
import { TherapistInviteForm } from 'bioflow/domains/Therapist/components'
import { useHistory } from 'react-router'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import { STUDIES } from 'bioflow/constants/collections'

function TherapistInvite(props) {
  //[ADDITIONAl HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const [studies] = useCollectionData(firebase.firestore().collection(STUDIES))

  // [CLEAN FUNCTIONS]
  const goBack = () => history.goBack()

  const handleTherapistInviteFormSubmit = (values) => {}

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
      <TherapistInviteForm
        onSubmit={handleTherapistInviteFormSubmit}
        studies={studies}
      />
    </PageWrapper>
  )
}

TherapistInvite.propTypes = {}

export default TherapistInvite
