import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

// GET /api/proposals?businessId=...
export const getProposals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId } = req.query
    const proposals = await prisma.proposal.findMany({
      where: businessId ? { businessId: String(businessId) } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { business: { select: { id: true, name: true } } }
    })
    res.json({ success: true, data: proposals })
  } catch (err) {
    next(err)
  }
}

// GET /api/proposals/:id
export const getProposalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id },
      include: { business: { select: { id: true, name: true, town: true, industry: true, website: true } } }
    })
    if (!proposal) throw new AppError('Proposal not found', 404)
    res.json({ success: true, data: proposal })
  } catch (err) {
    next(err)
  }
}

// POST /api/proposals
export const createProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId, title, content, value, expiresAt } = req.body
    if (!businessId || !title || !content) throw new AppError('businessId, title, and content are required', 400)

    const proposal = await prisma.proposal.create({
      data: {
        businessId, title, content, value: Number(value) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })

    // Auto-update opportunity score and stage
    await prisma.business.update({
      where: { id: businessId },
      data: { stage: 'PROPOSAL_SENT', opportunityScore: { increment: 15 } }
    })

    res.status(201).json({ success: true, data: proposal })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/proposals/:id
export const updateProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await prisma.proposal.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: proposal })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/proposals/:id
export const deleteProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.proposal.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Proposal deleted' })
  } catch (err) {
    next(err)
  }
}
