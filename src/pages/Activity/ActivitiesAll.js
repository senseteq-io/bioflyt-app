import React from 'react'
import { Box, Container, Text, Title } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'

const MOCK_ACTIVITIES = [
  {
    day: '17.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '17.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '17.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Bergen',
    group: 'week35'
  },
  {
    day: '15.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '15.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Bergen',
    group: 'week35'
  },
  {
    day: '15.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '15.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Bergen',
    group: 'week35'
  },
  {
    day: '14.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Bergen',
    group: 'week35'
  },
  {
    day: '14.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Bergen',
    group: 'week35'
  },
  {
    day: '14.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '14.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '16.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '16.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '16.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '16.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '16.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '18.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '18.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '18.10.2021',
    time: '14:15',
    message: 'Sasha created group Week 36',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '18.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  }
]

function ActivitiesAll(props) {
  // const { WRITE_PROPS_HERE } = props
  // const { ADDITIONAL_DESTRUCTURING_HERE } = user

  // [ADDITIONAL HOOKS]
  // const { t } = useTranslation('translation')
  // const { currentLanguage } = t

  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]
  const actionsDates = MOCK_ACTIVITIES.map(({ day }) => day)
  const uniqueDates = actionsDates.filter(
    (day, index, self) => self.indexOf(day) === index
  )

  // [CLEAN FUNCTIONS]

  return (
    <Container mt={4}>
      {uniqueDates.map((date) => (
        <>
          <Box my={3}>
            <Title type="secondary" level={5}>
              {date}
            </Title>
          </Box>
          <ActivitiesList
            dataSource={MOCK_ACTIVITIES.filter(
              (activity) => activity.day === date
            )}
          />
        </>
      ))}
    </Container>
  )
}

ActivitiesAll.propTypes = {}

export default ActivitiesAll
