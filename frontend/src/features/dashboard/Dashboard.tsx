import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Calendar, Trophy, XCircle, FileText, PhoneCall, Mail, MessageSquare, Video, BriefcaseBusiness } from "lucide-react"
import type { DashboardStats } from "@/services/api.service"
import { dashboardApi } from "@/services/api.service"
import { motion } from "framer-motion"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

const revenueData = [
  { month: "Jan", value: 12000 }, { month: "Feb", value: 18000 },
  { month: "Mar", value: 15000 }, { month: "Apr", value: 22000 },
  { month: "May", value: 28000 }, { month: "Jun", value: 25000 },
  { month: "Jul", value: 32000 },
]

const sourceData = [
  { name: "Cold Outreach", value: 40, color: "#2563EB" },
  { name: "Referral", value: 25, color: "#10B981" },
  { name: "Social Media", value: 20, color: "#F59E0B" },
  { name: "LinkedIn", value: 15, color: "#8B5CF6" },
]

const interactionIcon: Record<string, React.ReactNode> = {
  CALL: <PhoneCall className="h-3.5 w-3.5" />,
  EMAIL: <Mail className="h-3.5 w-3.5" />,
  WHATSAPP: <MessageSquare className="h-3.5 w-3.5" />,
  MEETING: <Calendar className="h-3.5 w-3.5" />,
  DEMO: <Video className="h-3.5 w-3.5" />,
  PROPOSAL: <FileText className="h-3.5 w-3.5" />,
  FOLLOW_UP: <BriefcaseBusiness className="h-3.5 w-3.5" />,
}

function SkeletonCard() {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 animate-pulse">
      <CardHeader className="pb-2"><div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24" /></CardHeader>
      <CardContent><div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-2" /><div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-32" /></CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getStats().then(r => r.data.data as DashboardStats),
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metric Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <MetricCard title="Total Leads" value={data?.totalLeads ?? 0} sub="All time" icon={Users} color="blue" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard title="Active Opportunities" value={data?.activeOpportunities ?? 0} sub="In pipeline" icon={TrendingUp} color="indigo" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard title="Deals Won" value={data?.wonDeals ?? 0} sub="Closed deals" icon={Trophy} color="emerald" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard title="Deals Lost" value={data?.lostDeals ?? 0} sub="Total lost" icon={XCircle} color="red" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard title="Proposals Sent" value={data?.proposalsSent ?? 0} sub="Pending & accepted" icon={FileText} color="amber" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard title="Upcoming Tasks" value={data?.upcomingTasks?.length ?? 0} sub="Due soon" icon={Calendar} color="purple" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Revenue Forecast</CardTitle>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Projected monthly revenue trend</p>
          </CardHeader>
          <CardContent className="h-[240px] pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Leads by Source</CardTitle>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Where your leads come from</p>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {sourceData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Upcoming Tasks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">{Array.from({length: 4}).map((_,i)=><div key={i} className="flex gap-3 animate-pulse"><div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0"/><div className="flex-1 space-y-1"><div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"/><div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/></div></div>)}</div>
            ) : data?.recentInteractions?.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-6">No recent activity yet.</p>
            ) : (
              <div className="space-y-4">
                {(data?.recentInteractions ?? []).slice(0, 6).map((i) => (
                  <div key={i.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {interactionIcon[i.type] ?? <PhoneCall className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-snug">
                        <span className="font-medium">{i.type.replace('_', ' ')}</span> with <span className="font-medium">{i.business?.name}</span>
                      </p>
                      {i.notes && <p className="text-xs text-neutral-500 truncate mt-0.5">{i.notes}</p>}
                      <p className="text-xs text-neutral-400 mt-0.5">{new Date(i.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({length: 4}).map((_,i)=><div key={i} className="flex gap-3 animate-pulse"><div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 mt-1"/><div className="flex-1 space-y-1"><div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"/><div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/></div></div>)}</div>
            ) : data?.upcomingTasks?.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-6">No upcoming tasks. 🎉</p>
            ) : (
              <div className="space-y-3">
                {(data?.upcomingTasks ?? []).map((t) => (
                  <div key={t.id} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${t.priority === 'HIGH' ? 'bg-red-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{t.title}</p>
                      {t.business && <p className="text-xs text-neutral-500">{t.business.name}</p>}
                      <p className="text-xs text-neutral-400 mt-0.5">Due {new Date(t.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${t.priority === 'HIGH' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: number; sub: string; icon: React.ElementType
  color: 'blue' | 'indigo' | 'emerald' | 'red' | 'amber' | 'purple'
}) {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-600 dark:text-blue-400',   value: 'text-blue-700 dark:text-blue-300' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', value: 'text-indigo-700 dark:text-indigo-300' },
    emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-700 dark:text-emerald-300' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20',     text: 'text-red-600 dark:text-red-400',     value: 'text-red-700 dark:text-red-300' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', value: 'text-amber-700 dark:text-amber-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', value: 'text-purple-700 dark:text-purple-300' },
  }
  const c = colors[color]
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 overflow-hidden group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value.toLocaleString()}</div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{sub}</p>
      </CardContent>
    </Card>
  )
}
