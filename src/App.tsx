import 'react-native-gesture-handler'

import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'

import { useCachedResources } from '@/hooks'
import { RootNavigation } from '@/navigation'
import { TanstackProvider } from '@/providers'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useEffect } from 'react'

export default function App() {
	const isLoadingComplete = useCachedResources()

	useEffect(() => {
		GoogleSignin.configure()
	}, [])

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
						icons={{
							error: <Ionicons size={20} color='maroon' name='alert-circle' />,
							success: <Ionicons size={20} color='green' name='checkmark-circle' />,
							info: <Ionicons size={20} color='cornflowerblue' name='information-circle' />,
							warning: <Ionicons size={20} color='goldenrod' name='alert-circle' />,
						}}
						toastOptions={{
							titleStyle: {
								fontFamily: 'PolysansNeutral',
							},
						}}
						style={{
							borderRadius: 12,
							padding: 12,
							alignItems: 'center',
						}}
					/>
				</TanstackProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}
