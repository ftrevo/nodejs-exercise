import { Router } from 'express'
import priceController from '../controllers/price.controller'

const router = Router()

router.post('/', priceController.create)
router.get('/history', priceController.getHistory)
router.get('/active', priceController.getActive)

export default router
