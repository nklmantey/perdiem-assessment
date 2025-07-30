import 'react-native-gesture-handler'

import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'

import { useCachedResources } from '@/hooks'
import { RootNavigation } from '@/navigation'
import { TanstackProvider } from '@/providers'

export default function App() {
	const isLoadingComplete = useCachedResources()

	if (!isLoadingComplete) {
		return null
	}

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView>
				<TanstackProvider>
					<StatusBar style='auto' />
					<RootNavigation />
					<Toaster
						position='top-center'
						visibleToasts={1}
						theme='light'
						richColors
						toastOptions={{
							titleStyle: {
								fontFamily: 'CerealMedium',
								letterSpacing: -0.5,
							},
						}}
						duration={5000}
						style={{
							borderRadius: 12,
							padding: 16,
							alignItems: 'center',
						}}
					/>
				</TanstackProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}
