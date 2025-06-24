import express from 'express'
import authRouter from './routers/auth.router'
import productRouter from './routers/product.router'
import categoriesRouter from './routers/category.router'
import cartRouter from './routers/cart.router'
import orderRouter from './routers/order.router'
import reviewRouter from './routers/reviews.router'
import webHookRouter from './routers/webhook.router'
import voucherRouter from './routers/voucher.router'
import cookieParse from 'cookie-parser'
import cors from 'cors'
import { port } from './secret'


const app =  express()
app.use('/api/webhook',webHookRouter)
app.use(express.json())
app.use(cookieParse())
app.use('/api/auth',authRouter)
app.use('/api/products',productRouter)
app.use('/api/categories',categoriesRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/reviews',reviewRouter)
app.use('/api/vouchers',voucherRouter)
app.use(cors())

app.listen(port,()=>{
    console.log('server is up')
})