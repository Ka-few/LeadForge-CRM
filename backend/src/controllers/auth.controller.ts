import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'leadforge-super-secret-dev-key'
const JWT_EXPIRES_IN = '7d'

const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) throw new AppError('Name, email, and password are required', 400)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('A user with this email already exists', 409)

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const token = signToken(user.id)
    res.status(201).json({ success: true, token, data: user })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError('Email and password are required', 400)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = signToken(user.id)
    res.json({
      success: true,
      token,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}
