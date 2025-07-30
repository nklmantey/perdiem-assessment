import { z } from 'zod'

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
})

// INFERRED TYPES
export type LoginInputTyoe = z.infer<typeof loginSchema>
