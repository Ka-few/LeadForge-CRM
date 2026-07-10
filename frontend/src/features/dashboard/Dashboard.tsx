import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Calendar, CreditCard, Activity } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Welcome back. Here's what's happening with your pipeline today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Leads" value="1,284" change="+12%" icon={Users} trend="up" />
        <MetricCard title="Active Opportunities" value="42" change="+4" icon={TrendingUp} trend="up" />
        <MetricCard title="Meetings This Week" value="12" change="-2" icon={Calendar} trend="down" />
        <MetricCard title="Pipeline Value" value="$142,500" change="+24%" icon={CreditCard} trend="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-base font-medium">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-neutral-400">
            {/* Chart placeholder */}
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
              <p className="text-sm">Recharts Area Chart will go here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Meeting scheduled with Acme Corp</p>
                    <p className="text-xs text-neutral-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-md bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</div>
        <p className={`text-xs mt-1 font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
