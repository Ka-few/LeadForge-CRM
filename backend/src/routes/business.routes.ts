import { Router } from 'express'
import {
  getBusinesses, getBusinessById, createBusiness,
  updateBusiness, updateBusinessStage, deleteBusiness,
} from '../controllers/business.controller'

const router = Router()

router.get('/', getBusinesses)
router.get('/:id', getBusinessById)
router.post('/', createBusiness)
router.patch('/:id', updateBusiness)
router.patch('/:id/stage', updateBusinessStage)
router.delete('/:id', deleteBusiness)

export default router
