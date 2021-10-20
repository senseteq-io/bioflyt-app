import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { Col, PageWrapper, Row } from '@qonsoll/react-design'
import { GroupSimpleForm } from 'bioflow/domains/Group/components'

function GroupEdit(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()

  // [CLEAN FUNCTIONS]

  return (
    <PageWrapper
      onBack={history.goBack}
      headingProps={{
        title: t('Edit group'),
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

GroupEdit.propTypes = {}

export default GroupEdit
