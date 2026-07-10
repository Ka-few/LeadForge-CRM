import { Router } from 'express'
import { getInteractions, createInteraction } from '../controllers/interaction.controller'

const router = Router()

router.get('/', getInteractions)
router.post('/', createInteraction)

export default router
