import { Animated, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'

const OverrideIndicator = styled(View)`
	position: absolute;
	bottom: 2px;
	right: 2px;
	background-color: #ff9800;
	padding: 2px;
	border-radius: 2px;
`

const DateSlotButton = styled(TouchableOpacity)<{ isOpen: boolean }>`
	background-color: ${(props) => (props.isOpen ? '#e8f5e8' : '#ffe8e8')};
	padding: 0;
	border: 1px solid ${(props) => (props.isOpen ? '#4caf50' : '#f44336')};
	border-radius: 4px;
	width: 100px;
	height: 70px;
	align-items: center;
	justify-content: center;
	gap: 4px;
	opacity: ${(props) => (props.isOpen ? 1 : 0.6)};
	position: relative;
`

type DateSlotProps = {
	dateSlot: { date: Date; label: string }
	index: number
	animation: Animated.Value
	isOpen: boolean
	hours: string
	hasOverride?: boolean
	onPress: () => void
}

export function DateSlot({ dateSlot, index, animation, isOpen, hours, hasOverride, onPress }: DateSlotProps) {
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
			<DateSlotButton isOpen={isOpen} onPress={onPress}>
				<Typography size='sm'>{dateSlot.label}</Typography>
				<Typography size='sm' variant='secondary'>
					{hours}
				</Typography>
				{hasOverride && (
					<OverrideIndicator>
						<Typography size='xs'>OVERRIDE</Typography>
					</OverrideIndicator>
				)}
			</DateSlotButton>
		</Animated.View>
	)
}
