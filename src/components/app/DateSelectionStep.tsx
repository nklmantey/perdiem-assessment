import { ActivityIndicator, View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'
import { useDateTimePicker } from '@/hooks'
import { validateStoreSchedule } from '@/utils'
import { DateSlot } from './DateSlot'

type DateSelectionStepProps = {
	storeTimes: any
	storeOverrides: Record<string, any>
	overridesLoading: boolean
	hasAnyOverrides: boolean
	storeOverrideMutation: any
	dateSlotAnimations: any[]
	onDateSelect: (date: Date, startTime: string, endTime: string) => void
}

export function DateSelectionStep({
	storeTimes,
	storeOverrides,
	overridesLoading,
	hasAnyOverrides,
	storeOverrideMutation,
	dateSlotAnimations,
	onDateSelect,
}: DateSelectionStepProps) {
	const { generateDateSlots } = useDateTimePicker()
	const validatedSchedule = storeTimes ? validateStoreSchedule(storeTimes) : []

	return (
		<>
			<Typography weight='median' size='base'>
				Select Date
			</Typography>

			{(overridesLoading || storeOverrideMutation.isPending) && (
				<LoadingContainer>
					<ActivityIndicator />
					<Typography variant='secondary' size='sm'>
						Checking for store overrides...
					</Typography>
				</LoadingContainer>
			)}

			{!overridesLoading && !hasAnyOverrides && (
				<NoOverridesBanner>
					<Typography variant='secondary' size='sm'>
						No store overrides found for the next 30 days
					</Typography>
				</NoOverridesBanner>
			)}

			<DateSlotsContainer>
				{generateDateSlots().map((dateSlot, index) => {
					const dayOfWeek = dateSlot.date.getDay()
					const scheduleDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek
					const month = (dateSlot.date.getMonth() + 1).toString()
					const day = dateSlot.date.getDate().toString()
					const dateKey = `${month}/${day}`

					const daySchedule = validatedSchedule.find((schedule) => schedule.day_of_week === scheduleDayOfWeek)

					const override = storeOverrides[dateKey]

					const isOpen = override ? override.is_open : daySchedule?.is_open || false
					const hours = override
						? override.is_open && override.start_time && override.end_time
							? `${override.start_time} - ${override.end_time}`
							: 'Closed'
						: daySchedule?.is_open && daySchedule?.start_time && daySchedule?.end_time
						? `${daySchedule.start_time} - ${daySchedule.end_time}`
						: 'Closed'

					const hasOverride = !!override

					return (
						<DateSlot
							key={index}
							dateSlot={dateSlot}
							index={index}
							animation={dateSlotAnimations[index]}
							isOpen={isOpen}
							hours={hours}
							hasOverride={hasOverride}
							onPress={() => {
								if (isOpen && hours !== 'Closed') {
									const [startTime, endTime] = hours.split(' - ')
									onDateSelect(dateSlot.date, startTime, endTime)
								}
							}}
						/>
					)
				})}
			</DateSlotsContainer>
		</>
	)
}

const LoadingContainer = styled(View)`
	align-items: center;
	flex-direction: row;
	background-color: #e9e9e9;
	border-radius: 4px;
	padding: 4px 8px;
	gap: 8px;
	margin-bottom: 16px;
`

const NoOverridesBanner = styled(View)`
	align-items: center;
	padding: 12px;
	background-color: #e3f2fd;
	border: 1px solid #2196f3;
	border-radius: 4px;
	margin-bottom: 16px;
`

const DateSlotsContainer = styled(View)`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`
