import { useState } from 'react'
import { Animated } from 'react-native'

import { useAppInfoStore } from '@/stores'

type PickerStep = 'date' | 'time' | 'confirm'

export function useDateTimePicker() {
	const { setAppointment, clearAppointment } = useAppInfoStore()
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [selectedTime, setSelectedTime] = useState(new Date())
	const [pickerStep, setPickerStep] = useState<PickerStep>('date')
	const [timeSlotAnimations, setTimeSlotAnimations] = useState<Animated.Value[]>([])
	const [dateSlotAnimations, setDateSlotAnimations] = useState<Animated.Value[]>([])

	const generateDateSlots = (): { date: Date; label: string }[] => {
		const slots: { date: Date; label: string }[] = []
		const today = new Date()

		for (let i = 0; i < 30; i++) {
			const date = new Date(today)
			date.setDate(today.getDate() + i)

			const month = date.toLocaleDateString('en-US', { month: 'long' })
			const day = date.getDate()
			const label = `${month} ${day}`

			slots.push({ date, label })
		}
		return slots
	}

	const generateTimeSlots = (startTime: string, endTime: string): string[] => {
		const slots: string[] = []

		const [startHour, startMinute] = startTime.split(':').map(Number)
		const [endHour, endMinute] = endTime.split(':').map(Number)

		const startMinutes = startHour * 60 + startMinute
		const endMinutes = endHour * 60 + endMinute

		for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
			const hour = Math.floor(minutes / 60)
			const minute = minutes % 60
			const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
			slots.push(timeString)
		}

		return slots
	}

	const handleDateSlotSelect = (date: Date, startTime: string, endTime: string) => {
		setSelectedDate(date)
		setPickerStep('time')
		const slots = generateTimeSlots(startTime, endTime)
		const animations = slots.map(() => new Animated.Value(0))
		setTimeSlotAnimations(animations)

		animations.forEach((animation, index) => {
			Animated.timing(animation, {
				toValue: 1,
				duration: 300,
				delay: index * 50,
				useNativeDriver: true,
			}).start()
		})
	}

	const initializeDateAnimations = () => {
		const slots = generateDateSlots()
		const animations = slots.map(() => new Animated.Value(0))
		setDateSlotAnimations(animations)

		animations.forEach((animation, index) => {
			Animated.timing(animation, {
				toValue: 1,
				duration: 300,
				delay: index * 30,
				useNativeDriver: true,
			}).start()
		})
	}

	const handleTimeChange = (event: any, time?: Date) => {
		if (time) {
			setSelectedTime(time)
			setPickerStep('confirm')
		}
	}

	const handleTimeSlotSelect = (time: string) => {
		const [hours, minutes] = time.split(':').map(Number)
		const newTime = new Date()
		newTime.setHours(hours, minutes, 0, 0)
		setSelectedTime(newTime)
		setPickerStep('confirm')
	}

	const handleConfirm = () => {
		const finalDateTime = new Date(selectedDate)
		finalDateTime.setHours(selectedTime.getHours())
		finalDateTime.setMinutes(selectedTime.getMinutes())
		finalDateTime.setSeconds(0)
		finalDateTime.setMilliseconds(0)

		const appointment = {
			date: selectedDate,
			time: selectedTime,
			formattedDate: selectedDate.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			}),
			formattedTime: selectedTime.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		}

		setAppointment(appointment)
		setPickerStep('date')
		setSelectedDate(new Date())
		setSelectedTime(new Date())
	}

	const handleStartOver = () => {
		setPickerStep('date')
		setSelectedDate(new Date())
		setSelectedTime(new Date())
	}

	const handleReschedule = () => {
		clearAppointment()
		setPickerStep('date')
		setSelectedDate(new Date())
		setSelectedTime(new Date())
	}

	return {
		selectedDate,
		selectedTime,
		pickerStep,
		timeSlotAnimations,
		dateSlotAnimations,
		generateTimeSlots,
		generateDateSlots,
		handleDateSlotSelect,
		handleTimeChange,
		handleTimeSlotSelect,
		handleConfirm,
		handleStartOver,
		handleReschedule,
		initializeDateAnimations,
	}
}
