import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { Stage } from '@prisma/client'

const STAGES: Stage[] = [
  'RESEARCH', 'AUDIT_COMPLETE', 'CONTACTED', 'MEETING_SCHEDULED',
  'DEMO_PRESENTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST',
]

// GET /api/pipeline - returns businesses grouped by stage
export const getPipeline = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true, name: true, stage: true, opportunityScore: true,
        industry: true, updatedAt: true, town: true,
        _count: { select: { interactions: true } },
        proposals: { select: { value: true }, take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const grouped = STAGES.reduce((acc, stage) => {
      acc[stage] = businesses.filter(b => b.stage === stage)
      return acc
    }, {} as Record<Stage, typeof businesses>)

    res.json({ success: true, data: grouped, stages: STAGES })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/pipeline/:id/move - move a card to a new stage
export const moveCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage } = req.body
    const business = await prisma.business.update({
      where: { id: req.params.id },
      data: { stage: stage as Stage },
      select: { id: true, name: true, stage: true },
    })
    res.json({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}
