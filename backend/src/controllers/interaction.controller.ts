import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

// GET /api/interactions?businessId=...
export const getInteractions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId } = req.query
    const interactions = await prisma.interaction.findMany({
      where: businessId ? { businessId: String(businessId) } : undefined,
      orderBy: { date: 'desc' },
      include: { user: { select: { id: true, name: true } }, business: { select: { id: true, name: true } } },
    })
    res.json({ success: true, data: interactions })
  } catch (err) {
    next(err)
  }
}

// POST /api/interactions
export const createInteraction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, notes, outcome, nextAction, businessId, userId, date } = req.body
    if (!type || !businessId) throw new AppError('Type and businessId are required', 400)

    const resolvedUserId = userId || (await prisma.user.findFirst())?.id
    if (!resolvedUserId) throw new AppError('No users found', 500)

    const interaction = await prisma.interaction.create({
      data: { type, notes, outcome, nextAction, businessId, userId: resolvedUserId, date: date ? new Date(date) : undefined },
      include: { user: { select: { id: true, name: true } } },
    })
    res.status(201).json({ success: true, data: interaction })
  } catch (err) {
    next(err)
  }
}
