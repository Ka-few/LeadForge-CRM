import { Router } from 'express'
import { getTasks, createTask, toggleComplete, updateTask, deleteTask } from '../controllers/task.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)
router.get('/', getTasks)
router.post('/', createTask)
router.patch('/:id/complete', toggleComplete)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
