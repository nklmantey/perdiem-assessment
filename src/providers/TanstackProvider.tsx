import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, createContext, useContext, useState } from 'react'

type QueryClientContextType = {
	queryClient: QueryClient
}

const QueryClientContext = createContext<QueryClientContextType | null>(null)

export function useQueryClient() {
	const context = useContext(QueryClientContext)
	if (!context) {
		throw new Error('useQueryClient must be used within a TanstackProvider')
	}
	return context.queryClient
}

export function TanstackProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientContext.Provider value={{ queryClient }}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</QueryClientContext.Provider>
	)
}
