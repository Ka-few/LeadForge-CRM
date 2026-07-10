import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { Stage } from '@prisma/client'

// GET /api/businesses
export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, stage, industry, page = '1', limit = '20' } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { industry: { contains: String(search), mode: 'insensitive' } },
        { town: { contains: String(search), mode: 'insensitive' } },
      ]
    }
    if (stage) where.stage = String(stage) as Stage
    if (industry) where.industry = { contains: String(industry), mode: 'insensitive' }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: Number(limit),
        include: { contacts: true, _count: { select: { interactions: true, tasks: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.business.count({ where }),
    ])

    res.json({ success: true, data: businesses, meta: { total, page: Number(page), limit: Number(limit) } })
  } catch (err) {
    next(err)
  }
}

// GET /api/businesses/:id
export const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.params.id },
      include: {
        contacts: true,
        interactions: { orderBy: { date: 'desc' } },
        tasks: { orderBy: { dueDate: 'asc' } },
        audits: { orderBy: { createdAt: 'desc' }, take: 1 },
        proposals: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!business) throw new AppError('Business not found', 404)
    res.json({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}

// POST /api/businesses
export const createBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, industry, website, websiteStatus, facebook, instagram, linkedin,
      address, county, town, notes, tags, contacts, ownerId } = req.body

    if (!name) throw new AppError('Business name is required', 400)
    // Default ownerId for now (will be replaced by JWT auth)
    const resolvedOwnerId = ownerId || (await prisma.user.findFirst())?.id
    if (!resolvedOwnerId) throw new AppError('No users found. Please create a user first.', 500)

    // Calculate opportunity score
    let score = 0
    if (websiteStatus === 'NO_WEBSITE') score += 35
    else if (websiteStatus === 'OUTDATED') score += 20
    if (facebook) score += 10

    const business = await prisma.business.create({
      data: {
        name, industry, website, websiteStatus, facebook, instagram, linkedin,
        address, county, town, notes, tags: tags || [], opportunityScore: score,
        ownerId: resolvedOwnerId,
        contacts: contacts ? { create: contacts } : undefined,
      },
      include: { contacts: true },
    })
    res.status(201).json({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/businesses/:id
export const updateBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const business = await prisma.business.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/businesses/:id/stage
export const updateBusinessStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage } = req.body
    const business = await prisma.business.update({
      where: { id: req.params.id },
      data: { stage },
    })
    res.json({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/businesses/:id
export const deleteBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.business.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Business deleted' })
  } catch (err) {
    next(err)
  }
}
