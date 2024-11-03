import { Router } from 'express'
import packageController from '../controllers/package.controller'

const router = Router()

router.get('/', packageController.getAll)
router.post('/', packageController.create)
router.get('/:id', packageController.getDetails)
router.patch('/:id', packageController.update)

export default router
