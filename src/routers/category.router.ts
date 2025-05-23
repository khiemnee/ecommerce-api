import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.controller";

const router:Router = Router()

router.post('/',auth,checkRole,createCategory)
router.get('/',auth,getCategory)
router.put('/:id',auth,checkRole,updateCategory)
router.delete('/:id',auth,checkRole,deleteCategory)

export default router