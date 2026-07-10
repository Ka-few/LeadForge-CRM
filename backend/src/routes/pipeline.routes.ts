import { Router } from 'express'
import { getPipeline, moveCard } from '../controllers/pipeline.controller'

const router = Router()

router.get('/', getPipeline)
router.patch('/:id/move', moveCard)

export default router
