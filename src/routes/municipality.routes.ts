import { Router } from 'express'
import municipalityController from '../controllers/municipality.controller'

const router = Router()

router.get('/', municipalityController.getAll)
router.post('/', municipalityController.create)
router.get('/:id', municipalityController.getDetails)
router.patch('/:id', municipalityController.update)

export default router
