import dotenv from 'dotenv'

dotenv.config()

export const accessTokenKey = process.env.accessTokenKey
export const refeshTokenKey = process.env.refeshTokenKey
export const cloudName = process.env.cloudName
export const cloudApi = process.env.cloudApi
export const cloudApiSecret = process.env.cloudApiSecret
export const stripeKey = process.env.stripeKey
export const stripeEndPoint = process.env.stripeEndPoint
export const redisUserName = process.env.redisUserName
export const redisPassword = process.env.redisPassword
export const redisPort = process.env.redisPort
export const redisHost = process.env.redisHost
export const port = process.env.port
export const stripeApiKey = process.env.stripeApiKey