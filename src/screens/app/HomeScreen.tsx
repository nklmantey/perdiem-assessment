import { AppointmentDisplay, ConfirmationStep, DateSelectionStep, TimeSelectionStep } from '@/components/app'
import { Header, SafeareaContainer, Typography } from '@/components/global'
import { TabToggle } from '@/components/ui'
import { useDateTimePicker, useGreeting, useStoreOverrides, useStoreSchedule } from '@/hooks'
import { useAppInfoStore, useAuthStore } from '@/stores'
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
					<Typography variant='secondary'>{user?.name ?? user?.email}</Typography>
				</TextContainer>
				<Header />
			</HeaderContainer>

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
