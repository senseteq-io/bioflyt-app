import firebase from 'firebase'
import { useEffect, useState } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { USERS_MODEL_NAME } from 'app/constants/models'
import { BIOFLOW_THERAPIST_ROLE } from 'app/constants/userRoles'
import { THERAPISTS_PROFILE_MODEL_NAME } from 'bioflow/constants/collections'

const useAvailableTherapists = (clinicId, studyId, disabled) => {
  const [availableTherapists, setAvailableTherapists] = useState()
  const [loading, setLoading] = useState(true)

  // [DATA_FETCH]
  const [therapists] = useCollectionDataOnce(
    !disabled &&
      firebase
        .firestore()
        .collection(USERS_MODEL_NAME)
        .where('role', '==', BIOFLOW_THERAPIST_ROLE)
        .where(`clinics.${clinicId}`, '==', true)
  )

  useEffect(() => {
    const fetchData = async () => {
      const profiles = {}
      for (const { bioflowTherapistProfileId } of therapists) {
        const snapshot = await firebase
          .firestore()
          .collection(THERAPISTS_PROFILE_MODEL_NAME)
          .doc(bioflowTherapistProfileId)
          .get()
        profiles[bioflowTherapistProfileId] = snapshot.data().studies
      }
      const filteredTherapists = []
      therapists.forEach((therapistData) => {
        const { bioflowTherapistProfileId } = therapistData
        if (profiles[bioflowTherapistProfileId].includes(studyId)) {
          filteredTherapists.push(therapistData)
        }
      })
      setAvailableTherapists(filteredTherapists)
      setLoading(false)
    }

    therapists && fetchData()
  }, [therapists, studyId])

  return [availableTherapists, loading]
}

export default useAvailableTherapists
