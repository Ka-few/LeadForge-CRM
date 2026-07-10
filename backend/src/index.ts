import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'

import authRoutes from './routes/auth.routes'
import businessRoutes from './routes/business.routes'
import pipelineRoutes from './routes/pipeline.routes'
import interactionRoutes from './routes/interaction.routes'
import dashboardRoutes from './routes/dashboard.routes'
import auditRoutes from './routes/audit.routes'
import taskRoutes from './routes/task.routes'
import proposalRoutes from './routes/proposal.routes'
import { errorHandler } from './middleware/errorHandler'
import { protect } from './middleware/auth.middleware'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin) return callback(null, true)
    // Allow any localhost port in development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true)
    // Allow configured FRONTEND_URL in production
    if (origin === process.env.FRONTEND_URL) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check (public)
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes
app.use('/api/businesses', protect, businessRoutes)
app.use('/api/pipeline', protect, pipelineRoutes)
app.use('/api/interactions', protect, interactionRoutes)
app.use('/api/dashboard', protect, dashboardRoutes)
app.use('/api/audits', protect, auditRoutes)
app.use('/api/proposals', proposalRoutes) // protected internally via router.use
app.use('/api/tasks', taskRoutes) // protected internally via router.use

// Global Error Handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`⚡️ LeadForge API running at http://localhost:${port}`)
})
