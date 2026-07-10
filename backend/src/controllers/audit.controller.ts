import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

// GET /api/audits/:businessId
export const getAuditForBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const audit = await prisma.websiteAudit.findFirst({
      where: { businessId: req.params.businessId },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: audit })
  } catch (err) {
    next(err)
  }
}

// POST /api/audits
export const createAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId, sections } = req.body
    if (!businessId || !sections) throw new AppError('businessId and sections are required', 400)

    // Calculate overall score
    const sectionScores: number[] = Object.values(sections)
    const score = Math.round(sectionScores.reduce((a: number, b: unknown) => a + (Number(b) || 0), 0) / sectionScores.length)

    // Auto-generate strengths/weaknesses/recommendations
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    const SECTION_LABELS: Record<string, string> = {
      design: 'Visual Design & Branding',
      ux: 'User Experience',
      performance: 'Page Speed & Performance',
      mobile: 'Mobile Responsiveness',
      seo: 'Search Engine Optimization',
      security: 'Security & Trust Signals',
      content: 'Content Quality',
      cta: 'Calls-to-Action',
      leadGen: 'Lead Generation',
    }

    for (const [key, val] of Object.entries(sections)) {
      const score = Number(val)
      const label = SECTION_LABELS[key] || key
      if (score >= 75) strengths.push(`Strong ${label} (${score}/100)`)
      else if (score < 50) {
        weaknesses.push(`Poor ${label} needs attention (${score}/100)`)
        recommendations.push(`Improve ${label}: consider a professional review and redesign`)
      }
    }

    if (strengths.length === 0) strengths.push('Business has potential for digital improvement')
    if (weaknesses.length === 0) weaknesses.push('No major weaknesses detected at this stage')

    const estimatedImpact = score < 40
      ? 'High business impact — a professional website could significantly increase leads and credibility'
      : score < 70
      ? 'Medium impact — targeted improvements would increase conversion rates'
      : 'Maintenance level — focus on SEO and content to stay competitive'

    const audit = await prisma.websiteAudit.create({
      data: { businessId, score, strengths, weaknesses, recommendations, estimatedImpact },
    })

    // Update the business opportunity score
    await prisma.business.update({
      where: { id: businessId },
      data: { opportunityScore: { increment: score > 50 ? 10 : 20 } },
    })

    res.status(201).json({ success: true, data: audit })
  } catch (err) {
    next(err)
  }
}
