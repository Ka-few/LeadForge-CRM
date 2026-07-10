import { Router } from 'express'
import {
  getBusinesses, getBusinessById, createBusiness,
  updateBusiness, updateBusinessStage, deleteBusiness,
} from '../controllers/business.controller'
import { exportBusinessesCsv } from '../controllers/business.export.controller'

const router = Router()

// Order matters! /export must come before /:id so it doesn't get treated as an ID
router.get('/export', exportBusinessesCsv)
router.get('/', getBusinesses)
router.get('/:id', getBusinessById)
router.post('/', createBusiness)
router.patch('/:id', updateBusiness)
router.patch('/:id/stage', updateBusinessStage)
router.delete('/:id', deleteBusiness)

export default router
