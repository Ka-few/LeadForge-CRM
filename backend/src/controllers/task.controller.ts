import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { Priority } from '@prisma/client'

// GET /api/tasks
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { businessId, completed } = req.query

    const where: any = { userId }
    if (businessId) where.businessId = String(businessId)
    if (completed !== undefined) where.completed = completed === 'true'

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: { business: { select: { id: true, name: true } } },
    })

    res.json({ success: true, data: tasks })
  } catch (err) {
    next(err)
  }
}

// POST /api/tasks
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { title, description, dueDate, priority, businessId } = req.body
    if (!title || !dueDate) throw new AppError('Title and dueDate are required', 400)

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: (priority as Priority) || Priority.MEDIUM,
        businessId: businessId || undefined,
        userId,
      },
      include: { business: { select: { id: true, name: true } } },
    })
    res.status(201).json({ success: true, data: task })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/tasks/:id/complete
export const toggleComplete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task) throw new AppError('Task not found', 404)

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: !task.completed },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/tasks/:id
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ success: true, data: task })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Task deleted' })
  } catch (err) {
    next(err)
  }
}
