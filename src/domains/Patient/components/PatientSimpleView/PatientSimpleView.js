import React, { Fragment, useMemo, useState } from 'react'
import moment from 'moment'
import { useTranslations } from '@qonsoll/translation'
import { Modal, Tooltip } from 'antd'
import { Box, Button, Card, Icon, Text } from '@qonsoll/react-design'
import { CheckOutlined } from '@ant-design/icons'
import { useBioflowAccess } from 'bioflow/hooks'
import { PatientSimpleForm } from '..'
import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'
import firebase from 'firebase'

const successIconStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'var(--ql-color-success)',
  fontSize: 'var(--ql-typography-font-size-lg)',
  height: 'var(--btn-height-base)'
}
const DATE_FORMAT_FOR_CONDITIONS = 'DD-MM-YYYY'
const checkIsTodayDate = (date) =>
  moment(date?.toDate()).format(DATE_FORMAT_FOR_CONDITIONS) ===
  moment().format(DATE_FORMAT_FOR_CONDITIONS)

function PatientSimpleView(props) {
  const {
    id: patientId,
    name,
    groupId,
    patients,
    startDay,
    fourthDay,
    threeMonthDay,
    firstDayBIOCollect,
    fourthDayBIOCollect,
    lastBIOCollect,
    onDeliverBio
  } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { isAdmin } = useBioflowAccess()
  const { update } = useSaveData()

  //[COMPONENT STATE HOOKS]
  const [isModalVisible, setIsModalVisible] = useState(false)

  //[COMPUTED PROPERTIES]
  const isTodayFirstDay = checkIsTodayDate(startDay)
  const isTodayFourthDay = checkIsTodayDate(fourthDay)
  const isTodayThreeMonthDay = threeMonthDay && checkIsTodayDate(threeMonthDay)

  const isBIOCollectEnabled = useMemo(
    () => isTodayFirstDay || isTodayFourthDay || isTodayThreeMonthDay,
    [startDay, fourthDay]
  )

  const nextTimeBIOCollect = useMemo(
    () =>
      `${t('Next bio collect on')} ${moment(fourthDay?.toDate()).format(
        'D MMM YYYY'
      )}`,
    [fourthDay]
  )

  //button always visible except situations when today deliver bio day
  //and today bio was sent
  const isDeliverBioButtonVisible = useMemo(
    () =>
      !isBIOCollectEnabled ||
      (isTodayFirstDay && !firstDayBIOCollect) ||
      (isTodayFourthDay && !fourthDayBIOCollect) ||
      (isTodayThreeMonthDay && !lastBIOCollect),
    [
      firstDayBIOCollect,
      fourthDayBIOCollect,
      lastBIOCollect,
      isBIOCollectEnabled,
      isTodayFirstDay,
      isTodayFourthDay,
      isTodayThreeMonthDay
    ]
  )

  //if today collect bio day and bio was collected
  //for any of dates(start day, fourth day or three months)
  //and also date for three month was set - show success icon
  const isSuccessIconVisible = useMemo(
    () =>
      (firstDayBIOCollect ||
        (fourthDayBIOCollect && threeMonthDay) ||
        lastBIOCollect) &&
      isBIOCollectEnabled,
    [
      firstDayBIOCollect,
      fourthDayBIOCollect,
      lastBIOCollect,
      threeMonthDay,
      isBIOCollectEnabled
    ]
  )

  //if user is therapist and today is fourth day when we collect bio
  //and date for three month visit wasn`t set - show set date button
  const setThreeMonthDateButtonVisible = useMemo(
    () =>
      !isAdmin && fourthDayBIOCollect && !threeMonthDay && isBIOCollectEnabled,
    [isAdmin, fourthDayBIOCollect, threeMonthDay, isBIOCollectEnabled]
  )

  //[CLEAN FUNCTIONS]
  const onOpenModal = () => {
    setIsModalVisible(true)
  }

  const onCloseModal = () => {
    setIsModalVisible(false)
  }

  const onSetThreeMonthDate = ({ threeMonthDay }) => {
    //find index of updated patient in patients array
    const patientIndex = patients?.findIndex(
      (patient) => patient?.id === patientId
    )

    const updatedPatientData = { ...patients[patientIndex] }
    //set three month date visit to patient data in firebase timestamp format
    if (patientIndex >= 0 && threeMonthDay && groupId && patientId) {
      updatedPatientData.threeMonthDay = firebase.firestore.Timestamp.fromDate(
        new Date(threeMonthDay)
      )

      update({
        collection: GROUPS_MODEL_NAME,
        id: groupId,
        data: { patients: [...patients, updatedPatientData] }
      })
    }
    setIsModalVisible(false)
  }

  return (
    <Fragment>
      <Card
        shadowless
        bordered={false}
        size="small"
        bg="var(--ql-color-dark-t-lighten6)">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tooltip title={name}>
            <Text isEllipsis pr={3}>
              {name}
            </Text>
          </Tooltip>
          <Box>
            {isDeliverBioButtonVisible && (
              <Tooltip title={isAdmin && "Admin can't collect BIO"}>
                <Box>
                  <Button
                    ghost
                    type="primary"
                    onClick={() => onDeliverBio(props)}
                    disabled={!isBIOCollectEnabled || isAdmin}>
                    {t('Deliver Bio')}
                  </Button>
                </Box>
              </Tooltip>
            )}
            {isSuccessIconVisible && (
              <Tooltip title={nextTimeBIOCollect}>
                <Icon {...successIconStyles} component={<CheckOutlined />} />
              </Tooltip>
            )}
            {setThreeMonthDateButtonVisible && (
              <Button ghost type="primary" onClick={onOpenModal}>
                {t('Set three month date')}
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      <Modal centered visible={isModalVisible} closable={false} footer={null}>
        <PatientSimpleForm
          onCancel={onCloseModal}
          onSubmit={onSetThreeMonthDate}
        />
      </Modal>
    </Fragment>
  )
}

PatientSimpleView.propTypes = {}

export default PatientSimpleView
