import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Building2, 
  KanbanSquare, 
  Settings, 
  PieChart, 
  FileText 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { name: "Proposals", href: "/proposals", icon: FileText },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
            LF
          </div>
          LeadForge
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate">Demo User</div>
            <div className="text-xs text-neutral-500 truncate">user@leadforge.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
