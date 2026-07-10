import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { pipelineApi, Business, Stage } from "@/services/api.service"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const STAGE_LABELS: Record<Stage, string> = {
  RESEARCH: "Research",
  AUDIT_COMPLETE: "Audit Complete",
  CONTACTED: "Contacted",
  MEETING_SCHEDULED: "Meeting Scheduled",
  DEMO_PRESENTED: "Demo Presented",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won 🎉",
  LOST: "Lost",
}

const STAGE_ORDER: Stage[] = [
  "RESEARCH", "AUDIT_COMPLETE", "CONTACTED", "MEETING_SCHEDULED",
  "DEMO_PRESENTED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST",
]

const STAGE_COLORS: Record<Stage, string> = {
  RESEARCH: "text-neutral-600 dark:text-neutral-400",
  AUDIT_COMPLETE: "text-blue-600 dark:text-blue-400",
  CONTACTED: "text-purple-600 dark:text-purple-400",
  MEETING_SCHEDULED: "text-indigo-600 dark:text-indigo-400",
  DEMO_PRESENTED: "text-cyan-600 dark:text-cyan-400",
  PROPOSAL_SENT: "text-amber-600 dark:text-amber-400",
  NEGOTIATION: "text-orange-600 dark:text-orange-400",
  WON: "text-emerald-600 dark:text-emerald-400",
  LOST: "text-red-600 dark:text-red-400",
}

function PipelineCard({ business, onMove }: { business: Business; onMove: (id: string, stage: Stage) => void }) {
  const score = business.opportunityScore
  return (
    <motion.div layout layoutId={business.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
      <Card className="p-3 cursor-grab active:cursor-grabbing border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all bg-white dark:bg-neutral-900 group">
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-1.5",
              score >= 80 ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20" :
              score >= 50 ? "text-blue-600 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20" :
              "text-neutral-500 border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
            )}
          >
            Score {score}
          </Badge>
          <button className="text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-snug mb-1">{business.name}</h4>
        {business.industry && <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{business.industry}</p>}
        {business.town && <p className="text-xs text-neutral-400 dark:text-neutral-500">{business.town}</p>}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
            <Building2 className="w-3 h-3" />
          </div>
          {/* Quick move buttons on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {STAGE_ORDER.filter(s => s !== business.stage).slice(0, 2).map(s => (
              <button
                key={s}
                onClick={() => onMove(business.id, s)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                → {STAGE_LABELS[s].replace(' 🎉', '')}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse space-y-2">
      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
    </div>
  )
}

export default function Pipeline() {
  const queryClient = useQueryClient()
  const [movingId, setMovingId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => pipelineApi.getAll().then(r => r.data),
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Stage }) => pipelineApi.moveCard(id, stage),
    onMutate: ({ id }) => setMovingId(id),
    onSuccess: (res) => {
      toast.success(`Moved to ${STAGE_LABELS[res.data.data.stage]}`)
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setMovingId(null),
  })

  const grouped: Record<Stage, Business[]> = data?.data ?? ({} as any)

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="mb-5 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Pipeline</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isLoading ? "Loading..." : `${Object.values(grouped).flat().length} active deals`}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
          <Plus className="h-4 w-4" /> Add Deal
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 items-start snap-x">
        {STAGE_ORDER.map((stage) => {
          const deals = grouped[stage] ?? []
          return (
            <div key={stage} className="flex-shrink-0 w-72 flex flex-col snap-start">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className={cn("font-semibold text-xs uppercase tracking-wider flex items-center gap-2", STAGE_COLORS[stage])}>
                  {STAGE_LABELS[stage]}
                  <span className="font-normal text-neutral-400 dark:text-neutral-600 normal-case tracking-normal">
                    ({deals.length})
                  </span>
                </h3>
                <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Body */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-2 flex-1 overflow-y-auto min-h-[120px] border border-neutral-200/50 dark:border-neutral-800/50">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: stage === 'RESEARCH' ? 2 : 1 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : deals.length === 0 ? (
                  <div className="flex items-center justify-center h-16 text-neutral-300 dark:text-neutral-700 text-xs">
                    No deals
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deals.map(deal => (
                      <div key={deal.id} className="relative">
                        {movingId === deal.id && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 rounded-xl">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          </div>
                        )}
                        <PipelineCard
                          business={deal}
                          onMove={(id, stage) => moveMutation.mutate({ id, stage })}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
