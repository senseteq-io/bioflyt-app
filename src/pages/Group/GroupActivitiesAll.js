import React from 'react'
import { Box, PageWrapper, Title } from '@qonsoll/react-design'
import { ActivitiesList } from 'bioflow/domains/Activity/components'
import { useTranslations } from '@qonsoll/translation'
import { useHistory } from 'react-router-dom'

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
    day: '15.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
  },
  {
    day: '15.10.2021',
    time: '13:13',
    message: 'Maxim invited new therapist',
    clinic: 'Oslo',
    group: 'week36'
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

function GroupActivitiesAll(props) {
  // const { WRITE_PROPS_HERE } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]
  const actionsDates = MOCK_ACTIVITIES.map(({ day }) => day)
  const uniqueDates = actionsDates.filter(
    (day, index, self) => self.indexOf(day) === index
  )
  // [CLEAN FUNCTIONS]

  return (
    <PageWrapper
      onBack={() => history.goBack()}
      headingProps={{
        title: MOCK_ACTIVITIES[0].group,
        subTitle: t('Activities'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
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
            isGroupActivity={true}
          />
        </>
      ))}
    </PageWrapper>
  )
}

GroupActivitiesAll.propTypes = {}

export default GroupActivitiesAll
