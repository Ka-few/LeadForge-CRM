import { PrismaClient, Stage, WebsiteStatus, InteractionType, Priority } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@leadforge.com' },
    update: {},
    create: {
      email: 'demo@leadforge.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created user:', user.email)

  // Seed businesses
  const businessData = [
    {
      name: 'Acme Web Studio',
      industry: 'Digital Agency',
      website: 'acme.com',
      websiteStatus: WebsiteStatus.MODERN,
      facebook: 'facebook.com/acme',
      town: 'Nairobi',
      county: 'Nairobi',
      stage: Stage.NEGOTIATION,
      opportunityScore: 85,
      tags: ['agency', 'web'],
    },
    {
      name: 'Global Logistics Ltd',
      industry: 'Transportation',
      website: 'globallogistics.net',
      websiteStatus: WebsiteStatus.OUTDATED,
      town: 'Mombasa',
      county: 'Mombasa',
      stage: Stage.RESEARCH,
      opportunityScore: 45,
      tags: ['logistics'],
    },
    {
      name: 'Dr. Smith Dentistry',
      industry: 'Healthcare',
      websiteStatus: WebsiteStatus.NO_WEBSITE,
      town: 'Kisumu',
      county: 'Kisumu',
      stage: Stage.MEETING_SCHEDULED,
      opportunityScore: 92,
      tags: ['healthcare', 'high-value'],
    },
    {
      name: 'Sunset Cafe',
      industry: 'Hospitality',
      websiteStatus: WebsiteStatus.NO_WEBSITE,
      facebook: 'facebook.com/sunsetcafe',
      town: 'Nakuru',
      county: 'Nakuru',
      stage: Stage.CONTACTED,
      opportunityScore: 55,
      tags: ['hospitality', 'social-media'],
    },
    {
      name: 'TechNova Solutions',
      industry: 'Software',
      website: 'technova.io',
      websiteStatus: WebsiteStatus.MODERN,
      facebook: 'facebook.com/technova',
      town: 'Nairobi',
      county: 'Nairobi',
      stage: Stage.PROPOSAL_SENT,
      opportunityScore: 68,
      tags: ['tech', 'software'],
    },
    {
      name: 'Greenlawn Gardens',
      industry: 'Landscaping',
      websiteStatus: WebsiteStatus.NO_WEBSITE,
      town: 'Eldoret',
      county: 'Uasin Gishu',
      stage: Stage.WON,
      opportunityScore: 78,
      tags: ['landscaping', 'won'],
    },
  ]

  for (const biz of businessData) {
    const business = await prisma.business.upsert({
      where: { id: biz.name }, // placeholder — will insert fresh
      update: {},
      create: { ...biz, ownerId: user.id },
    }).catch(async () => {
      return prisma.business.create({ data: { ...biz, ownerId: user.id } })
    })

    // Add a sample interaction per business
    await prisma.interaction.create({
      data: {
        type: InteractionType.CALL,
        notes: `Initial call with ${business.name}. Discussed current digital presence.`,
        outcome: 'Interested',
        nextAction: 'Send email with proposal overview',
        businessId: business.id,
        userId: user.id,
      },
    })

    // Add a task per business
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 3)
    await prisma.task.create({
      data: {
        title: `Follow up with ${business.name}`,
        dueDate,
        priority: Priority.HIGH,
        businessId: business.id,
        userId: user.id,
      },
    })
  }

  console.log('✅ Seeded', businessData.length, 'businesses with interactions and tasks.')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
