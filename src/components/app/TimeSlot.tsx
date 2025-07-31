import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'

type TimeSlotProps = {
	time: string
	index: number
	animation: Animated.Value
	onPress: () => void
}

export function TimeSlot({ time, index, animation, onPress }: TimeSlotProps) {
	return (
		<Animated.View
			key={index}
			style={{
				opacity: animation || 0,
				transform: [
					{
						translateY:
							animation?.interpolate({
								inputRange: [0, 1],
								outputRange: [20, 0],
							}) || 20,
					},
				],
			}}
		>
			<TimeSlotButton onPress={onPress}>
				<Typography size='sm'>{time}</Typography>
			</TimeSlotButton>
		</Animated.View>
	)
}

const TimeSlotButton = styled(TouchableOpacity)`
	background-color: #f5f5f5;
	padding: 8px 12px;
	border: 1px solid #e0e0e0;
	width: 80px;
	border-radius: 4px;
	align-items: center;
	justify-content: center;
`
