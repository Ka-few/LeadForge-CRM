import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal, ExternalLink, Plus, RefreshCw, Download } from "lucide-react"
import { businessApi, Business, Stage } from "@/services/api.service"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import BusinessFormModal from "@/components/BusinessFormModal"

const stageColors: Record<Stage, string> = {
  RESEARCH: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  AUDIT_COMPLETE: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  MEETING_SCHEDULED: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  DEMO_PRESENTED: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  PROPOSAL_SENT: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  NEGOTIATION: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  WON: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOST: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden w-16">
        <div
          className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-blue-500' : 'bg-neutral-300'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-blue-600' : 'text-neutral-500'}`}>
        {score}
      </span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <TableRow className="border-neutral-200 dark:border-neutral-800">
      {Array.from({length: 5}).map((_, i) => (
        <TableCell key={i}><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></TableCell>
      ))}
    </TableRow>
  )
}

export default function Businesses() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['businesses', debouncedSearch],
    queryFn: () => businessApi.getAll(debouncedSearch ? { search: debouncedSearch } : undefined).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => businessApi.delete(id),
    onSuccess: () => {
      toast.success("Business deleted")
      queryClient.invalidateQueries({ queryKey: ['businesses'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    clearTimeout((window as any)._searchTimeout)
    ;(window as any)._searchTimeout = setTimeout(() => setDebouncedSearch(e.target.value), 400)
  }

  const businesses: Business[] = data?.data ?? []
  const total = data?.meta?.total ?? 0

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Businesses</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {isLoading ? "Loading..." : `${total} business${total !== 1 ? 'es' : ''} in your database`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await api.get('/businesses/export', { responseType: 'blob' })
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'leadforge_businesses.csv')
                document.body.appendChild(link)
                link.click()
                link.remove()
              } catch (err) {
                toast.error('Failed to export CSV')
              }
            }}
            className="gap-2 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0 gap-2">
            <Plus className="h-4 w-4" /> Add Business
          </Button>
        </div>
      </div>

      <BusinessFormModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search businesses..."
              value={search}
              onChange={handleSearch}
              className="pl-9 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 h-9"
            />
          </div>
          <Button variant="outline" className="text-neutral-600 dark:text-neutral-300 gap-2 border-neutral-200 dark:border-neutral-800 h-9">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          {isFetching && !isLoading && (
            <RefreshCw className="h-4 w-4 text-neutral-400 animate-spin" />
          )}
        </div>

        <Table>
          <TableHeader className="bg-neutral-50/70 dark:bg-neutral-950/70">
            <TableRow className="border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
              <TableHead className="w-[260px] text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Business</TableHead>
              <TableHead className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Industry</TableHead>
              <TableHead className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Location</TableHead>
              <TableHead className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Score</TableHead>
              <TableHead className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Stage</TableHead>
              <TableHead className="text-right text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 6}).map((_, i) => <SkeletonRow key={i} />)
            ) : businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-neutral-400 dark:text-neutral-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-neutral-200 dark:text-neutral-700" />
                    <p className="text-sm font-medium">No businesses found</p>
                    <p className="text-xs">Try a different search term or add your first lead</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((b, idx) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                  )}
                  onClick={() => navigate(`/businesses/${b.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-neutral-900 dark:text-neutral-100 text-sm">{b.name}</span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        {b.website ? (
                          <>{b.website} <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></>
                        ) : (
                          <span className="text-amber-500">No website</span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-300">{b.industry ?? "—"}</TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-300">{b.town ? `${b.town}${b.county ? `, ${b.county}` : ''}` : "—"}</TableCell>
                  <TableCell><ScoreBadge score={b.opportunityScore} /></TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", stageColors[b.stage])}>
                      {b.stage.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteMutation.mutate(b.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
