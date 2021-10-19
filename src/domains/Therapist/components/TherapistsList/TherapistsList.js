import { ListWithCreate } from 'app/components'
import { THERAPISTS } from 'bioflow/constants/collections'
import React from 'react'
import { TherapistSimpleView } from '..'
import { useTranslations } from '@qonsoll/translation'

const MOCK_THERAPISTS = [
  {
    firstName: 'Trond',
    lastName: 'Klaboe',
    email: 'trond.claboe@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Oleksandr',
    lastName: 'Kazhuro',
    email: 'sasha@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Maxim',
    lastName: 'Makarov',
    email: 'maxim@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Trond',
    lastName: 'Klaboe',
    email: 'trond.claboe@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo',
        clinic: 'foi'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  }
]

function TherapistsList(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const goToInviteTherapist = () => {
    //TODO add route for invite Therapist form
    // history.push(BIOF)
  }

  return (
    <ListWithCreate
      grid={{
        gutter: [32, 16],
        xs: 1,
        sm: 1,
        md: 1,
        lg: 2,
        xl: 4,
        xxl: 4
      }}
      createVariant="large"
      createText={t('Invite therapist')}
      onCreate={goToInviteTherapist}
      collection={THERAPISTS}
      withCreate
      dataSource={MOCK_THERAPISTS}>
      <TherapistSimpleView />
    </ListWithCreate>
  )
}

TherapistsList.propTypes = {}

export default TherapistsList
