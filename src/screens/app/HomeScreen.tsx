import { AppointmentDisplay, ConfirmationStep, DateSelectionStep, TimeSelectionStep } from '@/components/app'
import { Header, SafeareaContainer, Typography } from '@/components/global'
import { Button, TabToggle } from '@/components/ui'
import { useDateTimePicker, useGreeting, usePushNotifications, useStoreNotification, useStoreOverrides, useStoreSchedule } from '@/hooks'
import { useAppInfoStore, useAuthStore } from '@/stores'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components'

export default function HomeScreen() {
	const { user } = useAuthStore()
	const { timezone, setTimezone, appointment } = useAppInfoStore()
	const storeTimes = useStoreSchedule()
	const currentGreeting = useGreeting(timezone)
	const { storeOverrides, overridesLoading, hasAnyOverrides, storeOverrideMutation } = useStoreOverrides(storeTimes)
	const [selectedStoreHours, setSelectedStoreHours] = useState<{ startTime: string; endTime: string } | null>(null)

	const { currentOpening } = useStoreNotification(storeTimes, storeOverrides, timezone, overridesLoading)
	const { expoPushToken } = usePushNotifications()

	const {
		selectedDate,
		selectedTime,
		pickerStep,
		timeSlotAnimations,
		dateSlotAnimations,
		handleDateSlotSelect,
		handleTimeSlotSelect,
		handleConfirm,
		handleStartOver,
		handleReschedule,
		initializeDateAnimations,
	} = useDateTimePicker()

	const handleDateSelect = (date: Date, startTime: string, endTime: string) => {
		setSelectedStoreHours({ startTime, endTime })
		handleDateSlotSelect(date, startTime, endTime)
	}

	if (!timezone) {
		setTimezone('nyc')
	}

	useEffect(() => {
		initializeDateAnimations()
	}, [])

	const timezoneOptions: { label: string; value: 'nyc' | 'local' }[] = [
		{ label: 'NYC', value: 'nyc' },
		{ label: 'Local', value: 'local' },
	]

	return (
		<SafeareaContainer>
			<TabToggle options={timezoneOptions} selectedValue={timezone ?? 'nyc'} onValueChange={setTimezone} />

			<HeaderContainer>
				<TextContainer>
					<Typography weight='median' size='lg'>
						{currentGreeting}
					</Typography>
					<Typography variant='secondary'>{(user as any)?.name ?? user?.email}</Typography>
				</TextContainer>
				<Header />
			</HeaderContainer>

			{overridesLoading ? (
				<View style={{ backgroundColor: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 16 }}>
					<Typography weight='median' size='sm'>
						Loading store overrides...
					</Typography>
					<Typography variant='secondary' size='sm'>
						Notifications will be scheduled once data is loaded
					</Typography>
				</View>
			) : currentOpening ? (
				<View style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 16 }}>
					<Typography weight='median' size='sm'>
						Next Store Opening
					</Typography>
					<Typography variant='secondary' size='sm'>
						{currentOpening.dayName} at {currentOpening.startTime}
					</Typography>
					<Typography variant='secondary' size='sm'>
						{currentOpening.isOverride ? 'Override' : 'Regular Schedule'}
					</Typography>
					<Typography variant='secondary' size='sm'>
						Notification scheduled for:{' '}
						{currentOpening.openingTime
							? new Date(currentOpening.openingTime.getTime() - 60 * 60 * 1000).toLocaleString()
							: 'Not scheduled'}
					</Typography>
				</View>
			) : null}

			<Button
				title='Test Notification'
				onPress={async () => {
					console.log('Scheduling test notification...')
					const notificationId = await Notifications.scheduleNotificationAsync({
						content: {
							title: '🧪 Test Notification',
							body: 'This is a test notification to validate the system is working!',
						},
						trigger: null,
					})
					console.log('Test notification scheduled with ID:', notificationId)
				}}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				<DateTimeContainer>
					{appointment ? (
						<AppointmentDisplay appointment={appointment} onReschedule={handleReschedule} />
					) : (
						<>
							{pickerStep === 'date' && (
								<DateSelectionStep
									storeTimes={storeTimes}
									storeOverrides={storeOverrides}
									overridesLoading={overridesLoading}
									hasAnyOverrides={hasAnyOverrides}
									storeOverrideMutation={storeOverrideMutation}
									dateSlotAnimations={dateSlotAnimations}
									onDateSelect={handleDateSelect}
								/>
							)}

							{pickerStep === 'time' && selectedStoreHours && (
								<TimeSelectionStep
									selectedDate={selectedDate}
									startTime={selectedStoreHours.startTime}
									endTime={selectedStoreHours.endTime}
									timeSlotAnimations={timeSlotAnimations}
									onTimeSelect={handleTimeSlotSelect}
								/>
							)}

							{pickerStep === 'confirm' && (
								<ConfirmationStep
									selectedDate={selectedDate}
									selectedTime={selectedTime}
									onConfirm={handleConfirm}
									onStartOver={handleStartOver}
									onReschedule={handleReschedule}
								/>
							)}
						</>
					)}
				</DateTimeContainer>
			</ScrollView>
		</SafeareaContainer>
	)
}

const HeaderContainer = styled(View)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin: 20px 0px;
`

const TextContainer = styled(View)`
	gap: 4px;
`

const DateTimeContainer = styled(View)`
	gap: 16px;
	margin-top: 20px;
`
