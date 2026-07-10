import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'leadforge-super-secret-dev-key'

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authenticated. Please log in.', 401)
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    ;(req as any).userId = decoded.id
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('Invalid or expired token', 401))
  }
}
