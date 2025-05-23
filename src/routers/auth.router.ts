import { Router } from "express";
import { authLogin, authRegister, deleteUser, getListUsers, getMe, getUser, logOut, refeshToken } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";

const router:Router = Router()

router.post('/register',authRegister)
router.post('/login',authLogin)
router.get('/refeshToken',refeshToken)
router.delete('/logout',logOut)
router.get('/me',auth,getMe)
router.get('/users',auth,checkRole,getListUsers)
router.get('/:id',auth,checkRole,getUser)
router.delete('/:id',auth,checkRole,deleteUser)

export default router