import { View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'
import { useDateTimePicker } from '@/hooks'
import { TimeSlot } from './TimeSlot'

type TimeSelectionStepProps = {
	selectedDate: Date
	startTime: string
	endTime: string
	timeSlotAnimations: any[]
	onTimeSelect: (time: string) => void
}

export function TimeSelectionStep({ selectedDate, startTime, endTime, timeSlotAnimations, onTimeSelect }: TimeSelectionStepProps) {
	const { generateTimeSlots } = useDateTimePicker()

	return (
		<TimeSelectionContainer>
			<Typography variant='secondary' size='sm'>
				Selected Date:{' '}
				{selectedDate.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</Typography>
			<Typography weight='median' size='base'>
				Choose Time (15-minute intervals)
			</Typography>
			<TimeSlotsContainer>
				{generateTimeSlots(startTime, endTime).map((time, index) => (
					<TimeSlot key={index} time={time} index={index} animation={timeSlotAnimations[index]} onPress={() => onTimeSelect(time)} />
				))}
			</TimeSlotsContainer>
		</TimeSelectionContainer>
	)
}

const TimeSelectionContainer = styled(View)`
	gap: 12px;
`

const TimeSlotsContainer = styled(View)`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`
