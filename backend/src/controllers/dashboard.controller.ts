import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

// GET /api/dashboard
export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalLeads,
      activeOpportunities,
      wonDeals,
      lostDeals,
      proposalsSent,
      recentInteractions,
      upcomingTasks,
    ] = await Promise.all([
      prisma.business.count(),
      prisma.business.count({ where: { stage: { notIn: ['WON', 'LOST'] } } }),
      prisma.business.count({ where: { stage: 'WON' } }),
      prisma.business.count({ where: { stage: 'LOST' } }),
      prisma.proposal.count({ where: { status: { in: ['SENT', 'ACCEPTED'] } } }),
      prisma.interaction.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: { business: { select: { name: true } }, user: { select: { name: true } } },
      }),
      prisma.task.findMany({
        where: { completed: false, dueDate: { gte: new Date() } },
        take: 5,
        orderBy: { dueDate: 'asc' },
        include: { business: { select: { name: true } } },
      }),
    ])

    res.json({
      success: true,
      data: {
        totalLeads,
        activeOpportunities,
        wonDeals,
        lostDeals,
        proposalsSent,
        recentInteractions,
        upcomingTasks,
      },
    })
  } catch (err) {
    next(err)
  }
}
