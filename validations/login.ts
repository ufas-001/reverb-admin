import {z} from "zod"

export const loginValidator = z.object({
    password: z.string(),
    email: z.string().email("Invalid e-mail format")
})