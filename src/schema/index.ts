import { z } from 'zod'

export const loginSchema = z.object({
	email: z.email(),
	password: z.string({ error: 'Password is required' }),
})

// INFERRED TYPES
export type LoginInputType = z.infer<typeof loginSchema>
