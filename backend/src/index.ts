import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'

import businessRoutes from './routes/business.routes'
import pipelineRoutes from './routes/pipeline.routes'
import interactionRoutes from './routes/interaction.routes'
import dashboardRoutes from './routes/dashboard.routes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/businesses', businessRoutes)
app.use('/api/pipeline', pipelineRoutes)
app.use('/api/interactions', interactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Global Error Handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`⚡️ LeadForge API running at http://localhost:${port}`)
})
