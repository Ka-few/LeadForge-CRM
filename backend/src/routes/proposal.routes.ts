import { Router } from 'express'
import { getProposals, getProposalById, createProposal, updateProposal, deleteProposal } from '../controllers/proposal.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)
router.get('/', getProposals)
router.get('/:id', getProposalById)
router.post('/', createProposal)
router.patch('/:id', updateProposal)
router.delete('/:id', deleteProposal)

export default router
