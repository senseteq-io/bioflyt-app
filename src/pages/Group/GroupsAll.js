import { Button, Container, PageWrapper } from '@qonsoll/react-design'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { GroupsList } from 'bioflow/domains/Group/components'
import { FilterOutlined } from '@ant-design/icons'
import firebase from 'firebase/app'

function GroupsAll(props) {
  const { inTab, isDrawerVisible, setIsDrawerVisible } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false)

  if (inTab) {
    return (
      <Container mt={4}>
        <GroupsList
          isFilterDrawerVisible={isDrawerVisible}
          setIsFilterDrawerVisible={setIsDrawerVisible}
        />
      </Container>
    )
  }

  const onOpenFilterDrawer = () => {
    setIsFilterDrawerVisible(true)
  }

  firebase.functions().useFunctionsEmulator("http://localhost:5001/foi-backend-app-prod/us-central1")

  return (
    <PageWrapper
      headingProps={{
        title: t('Groups'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}
      action={
        <Button
          icon={<FilterOutlined />}
          type="primary"
          onClick={onOpenFilterDrawer}>
          {t('Filter')}
        </Button>
      }>
      {/* <GroupsList
        isFilterDrawerVisible={isFilterDrawerVisible}
        setIsFilterDrawerVisible={setIsFilterDrawerVisible}
      /> */}
      <Button
          type="primary"
          onClick={() => firebase.functions().httpsCallable('onFirstCollectBioCheck')()}>
          {t('first check bio')}
        </Button>
        <Button
          type="primary"
          onClick={() => firebase.functions().httpsCallable('onFirst3MonthRegistration')()}>
          {t('second check bio')}
        </Button>
        <Button
          type="primary"
          onClick={() =>  firebase.functions().httpsCallable('onFirst3MonthRegistration')()}>
          {t('first three month')}
        </Button>
        <Button
          type="primary"
          onClick={ ()=>firebase.functions().httpsCallable('onSecond3MonthRegistration')()}>
          {t('second three month')}
        </Button>
    </PageWrapper>
  )
}

GroupsAll.propTypes = {}

export default GroupsAll
