import { Router } from 'express'
import { getAuditForBusiness, createAudit } from '../controllers/audit.controller'

const router = Router()

router.get('/:businessId', getAuditForBusiness)
router.post('/', createAudit)

export default router
