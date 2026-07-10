import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Building2, KanbanSquare, Settings,
  PieChart, FileText, CheckSquare, LogOut, Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Proposals", href: "/proposals", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            LF
          </div>
          <span className="text-blue-600 dark:text-blue-500">LeadForge</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-3 px-3">
          Workspace
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-blue-600 dark:text-blue-400")} />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-neutral-400 truncate">{user?.email ?? ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
