import express from 'express'
import { Router } from 'express'
import { webHookOrder } from '../controllers/webhook.controller'


const router:Router =  Router()

router.post('/',express.raw({ type: 'application/json' }),webHookOrder)

export default router
