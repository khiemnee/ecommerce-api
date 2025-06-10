import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { allOrders, order, orderCheckOut, userOrders } from "../controllers/order.controller";
import { checkRole } from "../middlewares/role.middleware";
import { userOrdersCache } from "../services/redis/cache.service";

const router:Router =  Router()

router.post('/checkout',auth,orderCheckOut)
router.get('/',auth,userOrdersCache,userOrders)
router.get('/:id',auth,order)
router.get('/all/admin',auth,checkRole,allOrders)

export default router
