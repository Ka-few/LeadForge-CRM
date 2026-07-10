import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Circle, Plus, Trash2, Calendar, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const
type Priority = typeof PRIORITIES[number]

const PRIORITY_STYLES: Record<Priority, string> = {
  HIGH: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900',
  LOW: 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800',
}

interface Task {
  id: string; title: string; dueDate: string
  priority: Priority; completed: boolean
  business?: { id: string; name: string }
}

function groupTasks(tasks: Task[]) {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const today = new Date(now); today.setHours(23, 59, 59, 999)
  const overdue: Task[] = [], todayTasks: Task[] = [], upcoming: Task[] = []
  for (const t of tasks) {
    if (t.completed) continue
    const d = new Date(t.dueDate)
    if (d < now) overdue.push(t)
    else if (d <= today) todayTasks.push(t)
    else upcoming.push(t)
  }
  return { overdue, today: todayTasks, upcoming }
}

function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      <div className={cn(
        'flex items-start gap-3 p-3 rounded-xl border transition-all group',
        task.completed
          ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 opacity-50'
          : isOverdue
          ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50'
          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md'
      )}>
        <button onClick={onToggle} className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
          task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-600'
        )}>
          {task.completed && <CheckCircle className="h-3.5 w-3.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', task.completed && 'line-through text-neutral-400')}>{task.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn('text-xs flex items-center gap-1', isOverdue && !task.completed ? 'text-red-500 font-medium' : 'text-neutral-400')}>
              {isOverdue && !task.completed && <AlertTriangle className="h-3 w-3" />}
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {task.business && <span className="text-xs text-blue-500">{task.business.name}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', PRIORITY_STYLES[task.priority])}>
            {task.priority}
          </span>
          <button onClick={onDelete} className="text-neutral-300 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function Section({ title, tasks, icon, emptyMsg, onToggle, onDelete }: {
  title: string; tasks: Task[]; icon: React.ReactNode; emptyMsg: string
  onToggle: (id: string) => void; onDelete: (id: string) => void
}) {
  if (tasks.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{title}</h2>
        <span className="text-xs text-neutral-400">({tasks.length})</span>
      </div>
      <AnimatePresence>
        {tasks.map(t => <TaskCard key={t.id} task={t} onToggle={() => onToggle(t.id)} onDelete={() => onDelete(t.id)} />)}
      </AnimatePresence>
    </div>
  )
}

export default function Tasks() {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get<{ success: boolean; data: Task[] }>('/tasks').then(r => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/tasks', { title, dueDate, priority }),
    onSuccess: () => {
      toast.success('Task created!')
      qc.invalidateQueries({ queryKey: ['tasks'] })
      setTitle(''); setDueDate(''); setShowForm(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/complete`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => { toast.success('Task deleted'); qc.invalidateQueries({ queryKey: ['tasks'] }) },
  })

  const tasks = data ?? []
  const { overdue, today: todayTasks, upcoming } = groupTasks(tasks)
  const completed = tasks.filter(t => t.completed)
  const totalIncomplete = overdue.length + todayTasks.length + upcoming.length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {isLoading ? '…' : `${totalIncomplete} pending · ${completed.length} done`}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="Task title…"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && title && dueDate && createMutation.mutate()}
                  className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex-1"
                  />
                  <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    {PRIORITIES.map(p => (
                      <button key={p} onClick={() => setPriority(p)}
                        className={cn('px-3 py-2 text-xs font-medium transition-colors', priority === p
                          ? p === 'HIGH' ? 'bg-red-500 text-white' : p === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-neutral-500 text-white'
                          : 'bg-white dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={!title || !dueDate || createMutation.isPending} onClick={() => createMutation.mutate()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {createMutation.isPending ? 'Saving…' : 'Create Task'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : totalIncomplete === 0 && completed.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-200 dark:text-emerald-900" />
          <p className="text-neutral-500 font-medium">All clear! No tasks yet.</p>
          <p className="text-neutral-400 text-sm mt-1">Create your first task to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Section
            title="Overdue"
            tasks={overdue}
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            emptyMsg="No overdue tasks"
            onToggle={id => toggleMutation.mutate(id)}
            onDelete={id => deleteMutation.mutate(id)}
          />
          <Section
            title="Today"
            tasks={todayTasks}
            icon={<Calendar className="h-4 w-4 text-blue-500" />}
            emptyMsg="Nothing due today"
            onToggle={id => toggleMutation.mutate(id)}
            onDelete={id => deleteMutation.mutate(id)}
          />
          <Section
            title="Upcoming"
            tasks={upcoming}
            icon={<Circle className="h-4 w-4 text-neutral-400" />}
            emptyMsg="No upcoming tasks"
            onToggle={id => toggleMutation.mutate(id)}
            onDelete={id => deleteMutation.mutate(id)}
          />

          {completed.length > 0 && (
            <div className="space-y-2 opacity-60">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Completed ({completed.length})
              </h2>
              {completed.slice(0, 3).map(t => (
                <TaskCard key={t.id} task={t} onToggle={() => toggleMutation.mutate(t.id)} onDelete={() => deleteMutation.mutate(t.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
