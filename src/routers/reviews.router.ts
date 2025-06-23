import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createReview, getReviews } from "../controllers/reviews.controller";

const router = Router()

router.post('/:id',auth,createReview)
router.get('/:id',auth,getReviews)

export default router