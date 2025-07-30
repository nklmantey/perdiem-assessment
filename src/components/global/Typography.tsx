import { Text } from 'react-native'
import styled from 'styled-components'

type TypographyProps = {
	weight?: 'bulky' | 'median' | 'neutral' | 'slim'
	size?: 'sm' | 'base' | 'lg' | 'xl'
	variant?: 'primary' | 'secondary' | 'danger' | 'button'
	children: string
}

const FONT_WEIGHT_MAP = {
	bulky: 'PolysansBulky',
	median: 'PolysansMedian',
	neutral: 'PolysansNeutral',
	slim: 'PolysansSlim',
}

const FONT_SIZE_MAP = {
	sm: '14px',
	base: '16px',
	lg: '20px',
	xl: '28px',
}

const FONT_COLOR_MAP = {
	primary: '#212427',
	secondary: '#a1a1a1',
	danger: 'maroon',
	button: '#e9e9e9',
}

export default function Typography({ weight = 'neutral', size = 'sm', variant = 'primary', children }: TypographyProps) {
	const fontFamily = FONT_WEIGHT_MAP[weight]
	const fontSize = FONT_SIZE_MAP[size]
	const color = FONT_COLOR_MAP[variant]

	return (
		<StyledText fontFamily={fontFamily} fontSize={fontSize} color={color}>
			{children}
		</StyledText>
	)
}

const StyledText = styled(Text)<{ fontFamily: string; fontSize: string; color: string }>`
	font-family: ${(props) => props.fontFamily};
	font-size: ${(props) => props.fontSize};
	color: ${(props) => props.color};
`
