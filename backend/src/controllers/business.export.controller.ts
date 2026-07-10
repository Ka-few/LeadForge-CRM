import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

export const exportBusinessesCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contacts: true
      }
    })

    const fields = [
      'ID', 'Name', 'Industry', 'Town', 'County', 'Website', 'Stage',
      'Opportunity Score', 'Primary Contact Name', 'Primary Contact Email',
      'Primary Contact Phone', 'Created At'
    ]

    const csvRows = [fields.join(',')]

    for (const b of businesses) {
      const primaryContact = b.contacts[0]
      const row = [
        b.id,
        `"${b.name.replace(/"/g, '""')}"`,
        `"${b.industry || ''}"`,
        `"${b.town || ''}"`,
        `"${b.county || ''}"`,
        `"${b.website || ''}"`,
        b.stage,
        b.opportunityScore,
        `"${primaryContact?.name || ''}"`,
        `"${primaryContact?.email || ''}"`,
        `"${primaryContact?.phone || ''}"`,
        b.createdAt.toISOString()
      ]
      csvRows.push(row.join(','))
    }

    const csvString = csvRows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leadforge_businesses.csv"')
    res.send(csvString)
  } catch (err) {
    next(err)
  }
}
