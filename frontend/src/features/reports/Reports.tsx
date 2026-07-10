import { useQuery } from '@tanstack/react-query'
import { dashboardApi, pipelineApi } from '@/services/api.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Trophy, XCircle, FileText, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const SOURCE_DATA = [
  { name: 'Cold Outreach', value: 40, color: '#2563EB' },
  { name: 'Referral', value: 25, color: '#10B981' },
  { name: 'Social Media', value: 20, color: '#F59E0B' },
  { name: 'LinkedIn', value: 15, color: '#8B5CF6' },
]

const STAGE_LABELS: Record<string, string> = {
  RESEARCH: 'Research', AUDIT_COMPLETE: 'Audit', CONTACTED: 'Contacted',
  MEETING_SCHEDULED: 'Meeting', DEMO_PRESENTED: 'Demo',
  PROPOSAL_SENT: 'Proposal', NEGOTIATION: 'Negotiating', WON: 'Won', LOST: 'Lost',
}

const MONTHLY_DATA = [
  { month: 'Jan', leads: 18, won: 4 }, { month: 'Feb', leads: 24, won: 7 },
  { month: 'Mar', leads: 20, won: 5 }, { month: 'Apr', leads: 32, won: 9 },
  { month: 'May', leads: 28, won: 11 }, { month: 'Jun', leads: 35, won: 14 },
  { month: 'Jul', leads: 40, won: 18 },
]

export default function Reports() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getStats().then(r => r.data.data),
  })

  const { data: pipelineData, isLoading: pipelineLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => pipelineApi.getAll().then(r => r.data),
  })

  const stats = statsData
  const pipeline = pipelineData?.data ?? {}
  const stages = pipelineData?.stages ?? []

  const funnelData = stages
    .filter(s => s !== 'LOST')
    .map(stage => ({
      name: STAGE_LABELS[stage] || stage,
      value: (pipeline[stage] ?? []).length,
      fill: stage === 'WON' ? '#10B981' : '#2563EB',
    }))
    .filter(d => d.value > 0)

  const stageBarData = stages.map(stage => ({
    stage: STAGE_LABELS[stage] || stage,
    count: (pipeline[stage] ?? []).length,
    fill: stage === 'WON' ? '#10B981' : stage === 'LOST' ? '#EF4444' : '#2563EB',
  }))

  const totalDeals = stats ? stats.wonDeals + stats.lostDeals : 0
  const winRate = totalDeals > 0 ? Math.round((stats!.wonDeals / totalDeals) * 100) : 0

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Pipeline performance and conversion analytics</p>
      </div>

      {/* KPI Row */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Win Rate', value: `${winRate}%`, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Deals Won', value: stats?.wonDeals ?? '–', icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Deals Lost', value: stats?.lostDeals ?? '–', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Proposals Sent', value: stats?.proposalsSent ?? '–', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={itemVariants}>
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{label}</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{statsLoading ? '…' : value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Lead Source Pie */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Lead Sources</CardTitle>
            <p className="text-xs text-neutral-500">Where your leads originate</p>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_DATA} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {SOURCE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance Bar */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Monthly Performance</CardTitle>
            <p className="text-xs text-neutral-500">Leads generated vs. deals closed</p>
          </CardHeader>
          <CardContent className="h-[260px] pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: '12px', color: '#9ca3af' }}>{v}</span>} />
                <Bar dataKey="leads" name="Leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="won" name="Won" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage Distribution Bar */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Pipeline Stage Distribution</CardTitle>
            <p className="text-xs text-neutral-500">Number of deals in each stage</p>
          </CardHeader>
          <CardContent className="h-[220px] pr-2">
            {pipelineLoading ? (
              <div className="h-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-neutral-200 dark:text-neutral-700 animate-pulse" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageBarData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }} />
                  <Bar dataKey="count" name="Deals" radius={[0, 4, 4, 0]}>
                    {stageBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
