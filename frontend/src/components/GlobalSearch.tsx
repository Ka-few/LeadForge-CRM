import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Building2, X, ArrowRight } from 'lucide-react'
import { businessApi, Business } from '@/services/api.service'
import { cn } from '@/lib/utils'

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const { data } = useQuery({
    queryKey: ['search', query],
    queryFn: () => businessApi.getAll({ search: query, limit: '8' }).then(r => r.data.data as Business[]),
    enabled: query.length >= 2,
  })

  const results = data ?? []

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => { setSelectedIdx(0) }, [query])

  const handleSelect = useCallback((business: Business) => {
    navigate(`/businesses/${business.id}`)
    onClose()
    setQuery('')
  }, [navigate, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[selectedIdx]) handleSelect(results[selectedIdx])
    if (e.key === 'Escape') onClose()
  }

  const scoreColor = (s: number) => s >= 80 ? 'text-emerald-500' : s >= 50 ? 'text-blue-500' : 'text-neutral-400'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <Search className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search businesses, industries, locations…"
                  className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {query.length < 2 ? (
                  <div className="px-4 py-6 text-center text-sm text-neutral-400">
                    Type at least 2 characters to search…
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-neutral-400">
                    No results for "<span className="text-neutral-600 dark:text-neutral-300">{query}</span>"
                  </div>
                ) : (
                  <div>
                    <p className="px-4 pb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Businesses ({results.length})
                    </p>
                    {results.map((biz, i) => (
                      <button
                        key={biz.id}
                        onClick={() => handleSelect(biz)}
                        onMouseEnter={() => setSelectedIdx(i)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          i === selectedIdx ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        )}
                      >
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', i === selectedIdx ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-neutral-100 dark:bg-neutral-800')}>
                          <Building2 className={cn('h-3.5 w-3.5', i === selectedIdx ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{biz.name}</p>
                          <p className="text-xs text-neutral-500 truncate">
                            {[biz.industry, biz.town].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={cn('text-xs font-bold', scoreColor(biz.opportunityScore))}>
                            {biz.opportunityScore}
                          </span>
                          <ArrowRight className={cn('h-3.5 w-3.5 transition-opacity', i === selectedIdx ? 'text-blue-600 opacity-100' : 'opacity-0')} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 flex gap-4 text-xs text-neutral-400">
                <span><kbd className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-xs">↑↓</kbd> navigate</span>
                <span><kbd className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-xs">↵</kbd> open</span>
                <span><kbd className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-xs">Esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
