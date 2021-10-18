import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'

function GroupCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Create group'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 32
      }}>
      <Row noGutters h="center">
        <Col cw={[12, 8, 8, 6]}>
          <GroupSimpleForm />
        </Col>
      </Row>
    </PageWrapper>
  )
}

GroupCreate.propTypes = {}

export default GroupCreate
