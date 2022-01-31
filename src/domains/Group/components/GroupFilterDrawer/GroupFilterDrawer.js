import { useTranslations } from '@qonsoll/translation'
import { ClearOutlined } from '@ant-design/icons'
import { Box, Button, Col, Row, Select, Text } from '@qonsoll/react-design'
import { Form, Drawer, Select as AntSelect } from 'antd'
import { useGroupFilterInitialData } from '../../hooks'

const GroupFilterDrawer = (props) => {
  const {
    initialValues,
    isFilterDrawerVisible,
    setIsFilterDrawerVisible,
    setFilterData,
    onSubmitFilter
  } = props

  //[ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const [form] = Form.useForm()
  const {
    groupsWeekNumbers,
    numberOfPatients,
    formattedDisorders,
    studies
  } = useGroupFilterInitialData()

  //[CLEAN FUNCTIONS]
  const onDrawerClose = () => {
    setIsFilterDrawerVisible(false)
  }

  const onAcceptFilter = (values) => {
    const { numberOfPatients, weekNumber } = values
    const isFilterEmpty = !Object.values(values).filter(
      (fieldValue) => fieldValue
    )?.length

    //if form was submited without values reset data in storage
    if (isFilterEmpty) localStorage.setItem('filterData', JSON.stringify([]))
    //convert numbers as string to number
    if (!!numberOfPatients) values.numberOfPatients = Number(numberOfPatients)
    if (!!weekNumber) values.weekNumber = Number(weekNumber)

    //convert object to array of objects
    let fieldsWithValue = Object.keys(values).map((key) => ({
      [key]: values[key]
    }))
    //filter fields with undefiend value
    fieldsWithValue = fieldsWithValue?.filter(
      (item) => Object.values(item)?.[0]
    )
    onSubmitFilter?.(fieldsWithValue)
    setIsFilterDrawerVisible(false)
  }

  const onResetFilter = () => {
    //reset state filter data, storage and form fields
    setFilterData([])
    localStorage.setItem('filterData', JSON.stringify([]))
    form.resetFields()
  }

  const drawerTitle = (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Text> {t('Groups filter')}</Text>

      <Button icon={<ClearOutlined />} type="text" onClick={onResetFilter} />
    </Box>
  )

  return (
    <Drawer
      closable={false}
      title={drawerTitle}
      visible={isFilterDrawerVisible}
      onClose={onDrawerClose}>
      <Form form={form} initialValues={initialValues} onFinish={onAcceptFilter}>
        <Row noGutters>
          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Week number')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="weekNumber">
              <Select placeholder={t('Select week number')} allowClear>
                {groupsWeekNumbers?.map((weekNumber, index) => (
                  <AntSelect.Option key={index} value={weekNumber}>
                    {`${t('Week')} ${weekNumber}`}
                  </AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Number of patients')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="numberOfPatients">
              <Select placeholder={t('Select number of patients')} allowClear>
                {numberOfPatients.map((number) => (
                  <AntSelect.Option key={number}>{number}</AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Disorder')}</Text>
          </Col>
          <Col cw={12} mb={24}>
            <Form.Item name="disorderId">
              <Select placeholder={t('Select disorder')} allowClear>
                {Object.keys(formattedDisorders)?.map(
                  (clinicName, index) =>
                    formattedDisorders?.[clinicName]?.length && (
                      <AntSelect.OptGroup
                        key={index}
                        label={`${clinicName} (${t('clinic')})`}>
                        {formattedDisorders?.[clinicName]?.map((disorder) => (
                          <AntSelect.Option
                            key={disorder?._id}
                            value={disorder?._id}>
                            {disorder?.name}
                          </AntSelect.Option>
                        ))}
                      </AntSelect.OptGroup>
                    )
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col cw={12} mb={1}>
            <Text type="secondary"> {t('Study')}</Text>
          </Col>
          <Col cw={12} mb={4}>
            <Form.Item name="studyId">
              <Select placeholder={t('Select study')} allowClear>
                {studies?.map((study) => (
                  <AntSelect.Option key={study?._id} value={study?._id}>
                    {study?.name}
                  </AntSelect.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row h="right" noGutters>
          <Col cw="auto" mr={3}>
            <Button size="middle" type="text" onClick={onDrawerClose}>
              {t('Cancel')}
            </Button>
          </Col>

          <Col cw="auto">
            <Button size="middle" type="primary" onClick={form.submit}>
              {t('Apply')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default GroupFilterDrawer
