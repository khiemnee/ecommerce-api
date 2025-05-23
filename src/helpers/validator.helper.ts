import {z} from 'zod'


const authSchema = z.object({
    email : z.string({
        required_error : 'Please not empty field'
    }).email('Please enter valid email format'),
    name : z.string().nullable().optional(),
    password : z.string().min(8).max(16)
})


export type Auth = z.infer<typeof authSchema>
