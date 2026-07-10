import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { businessApi, interactionApi, Business, Interaction } from '@/services/api.service'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft, Globe, Facebook, Instagram, Linkedin,
  Phone, Mail, MapPin, Tag, Star, PhoneCall, MessageSquare,
  Calendar, FileText, Video, BriefcaseBusiness, Plus, CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const TABS = ['Overview', 'Timeline', 'Contacts', 'Tasks', 'Audit'] as const
type Tab = typeof TABS[number]

const INTERACTION_ICONS: Record<string, React.ReactNode> = {
  CALL: <PhoneCall className="h-4 w-4" />,
  EMAIL: <Mail className="h-4 w-4" />,
  WHATSAPP: <MessageSquare className="h-4 w-4" />,
  MEETING: <Calendar className="h-4 w-4" />,
  DEMO: <Video className="h-4 w-4" />,
  PROPOSAL: <FileText className="h-4 w-4" />,
  FOLLOW_UP: <BriefcaseBusiness className="h-4 w-4" />,
}

const INTERACTION_COLORS: Record<string, string> = {
  CALL: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  EMAIL: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  WHATSAPP: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  MEETING: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  DEMO: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
  PROPOSAL: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  FOLLOW_UP: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
}

const WEBSITE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NO_WEBSITE: { label: 'No Website', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  OUTDATED: { label: 'Outdated Website', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
  MODERN: { label: 'Modern Website', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
  UNKNOWN: { label: 'Unknown', color: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400' },
}

export default function BusinessProfile() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [showAddInteraction, setShowAddInteraction] = useState(false)
  const [interactionType, setInteractionType] = useState('CALL')
  const [interactionNotes, setInteractionNotes] = useState('')
  const [interactionOutcome, setInteractionOutcome] = useState('')
  const queryClient = useQueryClient()

  const { data: bizData, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => businessApi.getById(id!).then(r => r.data.data as Business),
    enabled: !!id,
  })

  const { data: interactionsData } = useQuery({
    queryKey: ['interactions', id],
    queryFn: () => interactionApi.getByBusiness(id!).then(r => r.data.data as Interaction[]),
    enabled: !!id,
  })

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.get<{ success: boolean; data: any[] }>('/tasks', { params: { businessId: id } }).then(r => r.data.data),
    enabled: !!id,
  })

  const { data: auditData } = useQuery({
    queryKey: ['audit', id],
    queryFn: () => api.get<{ success: boolean; data: any }>(`/audits/${id}`).then(r => r.data.data),
    enabled: !!id,
  })

  const addInteractionMutation = useMutation({
    mutationFn: () => interactionApi.create({ type: interactionType, notes: interactionNotes, outcome: interactionOutcome, businessId: id }),
    onSuccess: () => {
      toast.success('Interaction recorded')
      queryClient.invalidateQueries({ queryKey: ['interactions', id] })
      setShowAddInteraction(false)
      setInteractionNotes('')
      setInteractionOutcome('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.patch(`/tasks/${taskId}/complete`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', id] }),
  })

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-48" />
      <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
  )

  const biz = bizData
  if (!biz) return <div className="text-neutral-500">Business not found.</div>

  const wsStatus = WEBSITE_STATUS_LABELS[biz.websiteStatus] ?? WEBSITE_STATUS_LABELS.UNKNOWN
  const score = biz.opportunityScore
  const interactions = interactionsData ?? []
  const tasks = tasksData ?? []

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/businesses" className="mt-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white truncate">{biz.name}</h1>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', wsStatus.color)}>{wsStatus.label}</span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {[biz.industry, biz.town, biz.county].filter(Boolean).join(' · ')}
          </p>
        </div>
        {/* Opportunity Score */}
        <div className="flex-shrink-0 text-center">
          <div className={`text-3xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-blue-600' : 'text-neutral-400'}`}>{score}</div>
          <div className="text-xs text-neutral-500 -mt-1">/ 100 score</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex gap-0.5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Business Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {biz.website && <InfoRow icon={Globe} label="Website" value={biz.website} />}
                {biz.facebook && <InfoRow icon={Facebook} label="Facebook" value={biz.facebook} />}
                {biz.instagram && <InfoRow icon={Instagram} label="Instagram" value={biz.instagram} />}
                {biz.linkedin && <InfoRow icon={Linkedin} label="LinkedIn" value={biz.linkedin} />}
                {biz.town && <InfoRow icon={MapPin} label="Location" value={`${biz.town}${biz.county ? `, ${biz.county}` : ''}`} />}
                {biz.tags?.length > 0 && (
                  <div className="flex items-start gap-3 pt-1">
                    <Tag className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {biz.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Notes</CardTitle></CardHeader>
              <CardContent>
                {biz.notes
                  ? <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{biz.notes}</p>
                  : <p className="text-sm text-neutral-400 italic">No notes yet.</p>
                }
              </CardContent>
            </Card>

            {/* Contacts quick view */}
            {biz.contacts && biz.contacts.length > 0 && (
              <Card className="md:col-span-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                <CardHeader><CardTitle className="text-sm font-semibold">Key Contacts</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {biz.contacts.map(c => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-neutral-900 dark:text-white">{c.name}</p>
                          {c.position && <p className="text-xs text-neutral-500">{c.position}</p>}
                          {c.phone && <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{c.phone}</p>}
                          {c.email && <p className="text-xs text-neutral-400 flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'Timeline' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-500">{interactions.length} interaction{interactions.length !== 1 ? 's' : ''} recorded</p>
              <Button size="sm" onClick={() => setShowAddInteraction(!showAddInteraction)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-3.5 w-3.5" /> Log Interaction
              </Button>
            </div>

            {showAddInteraction && (
              <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(INTERACTION_ICONS).map(t => (
                      <button key={t} onClick={() => setInteractionType(t)}
                        className={cn('px-2.5 py-1 rounded-full text-xs font-medium transition-colors', interactionType === t ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700')}>
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <Input placeholder="Notes (what was discussed?)" value={interactionNotes} onChange={e => setInteractionNotes(e.target.value)} className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                  <Input placeholder="Outcome (e.g. Interested, Needs follow-up)" value={interactionOutcome} onChange={e => setInteractionOutcome(e.target.value)} className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => addInteractionMutation.mutate()} disabled={addInteractionMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddInteraction(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {interactions.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-neutral-200 dark:text-neutral-700" />
                <p className="text-sm">No interactions logged yet.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-4">
                  {interactions.map(i => (
                    <div key={i.id} className="flex gap-4 relative pl-10">
                      <div className={cn('absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', INTERACTION_COLORS[i.type] || 'bg-neutral-100 text-neutral-500')}>
                        {INTERACTION_ICONS[i.type]}
                      </div>
                      <Card className="flex-1 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">{i.type.replace('_', ' ')}</span>
                            <span className="text-xs text-neutral-400">{new Date(i.date).toLocaleDateString()}</span>
                          </div>
                          {i.notes && <p className="text-sm text-neutral-700 dark:text-neutral-300">{i.notes}</p>}
                          {i.outcome && <p className="text-xs text-neutral-500 mt-1">Outcome: <span className="font-medium">{i.outcome}</span></p>}
                          {i.nextAction && <p className="text-xs text-blue-500 mt-1">Next: {i.nextAction}</p>}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'Tasks' && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-neutral-200 dark:text-neutral-700" />
                <p className="text-sm">No tasks for this business.</p>
              </div>
            ) : tasks.map((t: any) => (
              <div key={t.id} className={cn('flex items-start gap-3 p-3 rounded-xl border transition-all', t.completed ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 opacity-60' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm')}>
                <button onClick={() => toggleTaskMutation.mutate(t.id)} className={cn('mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-600')}>
                  {t.completed && <CheckCircle className="h-3 w-3" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', t.completed && 'line-through text-neutral-400')}>{t.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Due {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0', t.priority === 'HIGH' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800')}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'Audit' && (
          <div className="space-y-4">
            {!auditData ? (
              <div className="text-center py-16">
                <Star className="h-8 w-8 mx-auto mb-3 text-neutral-200 dark:text-neutral-700" />
                <p className="text-sm text-neutral-500 mb-4">No website audit performed yet.</p>
                <Link to={`/audit/${id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Run Website Audit</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className={cn('text-5xl font-black', auditData.score >= 75 ? 'text-emerald-600' : auditData.score >= 50 ? 'text-amber-600' : 'text-red-600')}>{auditData.score}</div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Overall Audit Score</p>
                    <p className="text-xs text-neutral-500">{new Date(auditData.createdAt).toLocaleDateString()}</p>
                    <Link to={`/audit/${id}`} className="text-xs text-blue-500 hover:underline mt-1 inline-block">Re-run audit →</Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Strengths', items: auditData.strengths, color: 'text-emerald-600', dot: 'bg-emerald-500' },
                    { title: 'Weaknesses', items: auditData.weaknesses, color: 'text-red-500', dot: 'bg-red-500' },
                    { title: 'Recommendations', items: auditData.recommendations, color: 'text-blue-600', dot: 'bg-blue-500' },
                  ].map(({ title, items, dot }) => (
                    <Card key={title} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</CardTitle></CardHeader>
                      <CardContent>
                        <ul className="space-y-1.5">
                          {(items as string[]).map((item, i) => (
                            <li key={i} className="flex gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                              <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', dot)} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {auditData.estimatedImpact && (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Business Impact: </span>{auditData.estimatedImpact}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
      <span className="text-neutral-500 w-20 flex-shrink-0 text-xs">{label}</span>
      <span className="text-neutral-700 dark:text-neutral-300 text-sm truncate">{value}</span>
    </div>
  )
}
