import { ReactNode } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import styled from 'styled-components'

type SafeareaContainerProps = {
	children: ReactNode
}

export default function SafeareaContainer({ children }: SafeareaContainerProps) {
	return <Container>{children}</Container>
}

const Container = styled(SafeAreaView)`
	flex: 1;
	padding: 20px;
	background-color: #f9f9f9;
`
