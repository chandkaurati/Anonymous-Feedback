import {z} from "zod"

export const usernameValidation = z.string()
       .min(2, "username must be at least tow characters")
       .max(20, "username must be less than 20 characters")

export const signupSchemaVanliDation = z.object({
    username : usernameValidation,
    email : z.string().email({message: "invalid email address"}),
    password: z.string().min(6, {message : "password must be at least 6 characters"})
})