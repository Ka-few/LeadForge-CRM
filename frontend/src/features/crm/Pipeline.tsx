import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MoreHorizontal, Plus } from "lucide-react"

const stages = [
  "Research",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
]

const mockDeals = [
  { id: 1, name: "Global Logistics Ltd", stage: "Research", value: "$4,500", score: 45 },
  { id: 2, name: "Sunset Cafe", stage: "Contacted", value: "$1,200", score: 20 },
  { id: 3, name: "Dr. Smith Dentistry", stage: "Meeting Scheduled", value: "$8,500", score: 92 },
  { id: 4, name: "TechNova Solutions", stage: "Proposal Sent", value: "$12,000", score: 68 },
  { id: 5, name: "Acme Web Studio", stage: "Negotiation", value: "$5,000", score: 85 },
]

export default function Pipeline() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Pipeline</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Track and manage your active deals.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start snap-x">
        {stages.map((stage) => {
          const stageDeals = mockDeals.filter(d => d.stage === stage)
          return (
            <div key={stage} className="flex-shrink-0 w-80 flex flex-col max-h-full snap-start">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  {stage}
                  <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full px-1.5 min-w-[20px] text-center font-normal">
                    {stageDeals.length}
                  </Badge>
                </h3>
                <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl p-2 flex-1 overflow-y-auto min-h-[150px] border border-transparent dark:border-neutral-800/50">
                <div className="space-y-2">
                  {stageDeals.map(deal => (
                    <Card key={deal.id} className="p-3 cursor-grab active:cursor-grabbing border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-neutral-900 group">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={
                          deal.score >= 80 ? "text-emerald-600 border-emerald-200 dark:border-emerald-900/50" :
                          deal.score >= 50 ? "text-blue-600 border-blue-200 dark:border-blue-900/50" :
                          "text-neutral-500 border-neutral-200 dark:border-neutral-800"
                        }>
                          Score {deal.score}
                        </Badge>
                        <button className="text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 mb-1">{deal.name}</h4>
                      <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                          {deal.value}
                        </span>
                        <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                          <Building2 className="w-3 h-3" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
