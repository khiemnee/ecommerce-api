import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { addCartItem, deleteCart, deleteCartItem, getCart, updateCartItem } from "../controllers/cart.controller";

const router : Router = Router()

router.get('/',auth,getCart)
router.post('/:id',auth,addCartItem)
router.put('/:id',auth,updateCartItem)
router.delete('/:id',auth,deleteCartItem)
router.delete('/',auth,deleteCart)

export default router