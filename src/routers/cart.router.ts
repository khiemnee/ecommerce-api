import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { addCartItem, deleteCart, deleteCartItem, getCart, updateCartItem } from "../controllers/cart.controller";
import { cartCache } from "../services/redis/cache.service";

const router : Router = Router()

router.get('/',auth,cartCache,getCart)
router.post('/:id',auth,addCartItem)
router.put('/:id',auth,updateCartItem)
router.delete('/:id',auth,deleteCartItem)
router.delete('/',auth,deleteCart)

export default router