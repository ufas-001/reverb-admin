import {z} from "zod"

export const signUpValidator = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email()
})