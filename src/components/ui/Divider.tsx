import { View } from 'react-native'
import styled from 'styled-components'

export default function Divider() {
	return <StyledDivider />
}

const StyledDivider = styled(View)`
	flex: 1;
	height: 1px;
	background-color: #e9e9e9;
`
