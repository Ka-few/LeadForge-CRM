import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md sticky top-0 z-10">
      <div className="w-96">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input 
            type="search" 
            placeholder="Search businesses, contacts, notes..." 
            className="w-full bg-neutral-100/50 dark:bg-neutral-900/50 border-none pl-9 h-9 shadow-none focus-visible:ring-1 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-700" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-neutral-950"></span>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          New Lead
        </Button>
      </div>
    </header>
  )
}
