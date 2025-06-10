import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller";
import { checkRole } from "../middlewares/role.middleware";
import upload from "../helpers/upload.helper";
import { productsCache } from "../services/redis/cache.service";

const router:Router = Router()

router.get('/',auth,productsCache,getProducts)
router.get('/:id',auth,getProduct)
router.post('/',auth,checkRole,upload.single('imageUrl'),createProduct)
router.put('/:id',auth,checkRole,upload.single('image'),updateProduct)
router.delete('/:id',auth,checkRole,deleteProduct)

export default router