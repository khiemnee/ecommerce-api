import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { applyVoucher, createVoucher } from "../controllers/voucher.controller";

const router = Router()

router.post('/',auth,checkRole,createVoucher)
router.post('/apply',auth,applyVoucher)

export default router