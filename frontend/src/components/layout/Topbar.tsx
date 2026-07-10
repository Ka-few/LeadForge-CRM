import { useState, useEffect } from 'react'
import { Bell, Search, Sun, Moon, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import GlobalSearch from '@/components/GlobalSearch'
import BusinessFormModal from '@/components/BusinessFormModal'

export default function Topbar() {
  const { theme, toggle } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-10">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors w-72 text-sm"
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">Search businesses…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded px-1 py-0.5 text-neutral-400 flex-shrink-0">
            <span>⌘</span>K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-9 w-9 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg"
            title="Toggle dark mode"
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4 text-amber-500" />
              : <Moon className="h-4 w-4" />
            }
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </Button>

          {/* New Lead CTA */}
          <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3.5 text-sm font-medium gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" /> New Lead
          </Button>
        </div>
      </header>

      <BusinessFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
