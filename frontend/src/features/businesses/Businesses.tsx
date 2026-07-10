import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal, ExternalLink } from "lucide-react"

const mockBusinesses = [
  { id: 1, name: "Acme Web Studio", industry: "Digital Agency", score: 85, status: "Negotiation", website: "acme.com" },
  { id: 2, name: "Global Logistics Ltd", industry: "Transportation", score: 45, status: "Research", website: "globallogistics.net" },
  { id: 3, name: "Dr. Smith Dentistry", industry: "Healthcare", score: 92, status: "Meeting Scheduled", website: "smithdentistry.com" },
  { id: 4, name: "Sunset Cafe", industry: "Hospitality", score: 20, status: "Contacted", website: "No Website" },
  { id: 5, name: "TechNova Solutions", industry: "Software", score: 68, status: "Proposal Sent", website: "technova.io" },
]

export default function Businesses() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Businesses</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage your leads, clients, and opportunities.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0">
          Add Business
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input placeholder="Search businesses..." className="pl-9 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800" />
          </div>
          <Button variant="outline" className="text-neutral-600 dark:text-neutral-300 gap-2 border-neutral-200 dark:border-neutral-800">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        
        <Table>
          <TableHeader className="bg-neutral-50/50 dark:bg-neutral-950/50">
            <TableRow className="border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
              <TableHead className="w-[300px] text-neutral-600 dark:text-neutral-400 font-medium">Business Name</TableHead>
              <TableHead className="text-neutral-600 dark:text-neutral-400 font-medium">Industry</TableHead>
              <TableHead className="text-neutral-600 dark:text-neutral-400 font-medium">Opportunity Score</TableHead>
              <TableHead className="text-neutral-600 dark:text-neutral-400 font-medium">Current Stage</TableHead>
              <TableHead className="text-right text-neutral-600 dark:text-neutral-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBusinesses.map((b) => (
              <TableRow key={b.id} className="border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                  <div className="flex flex-col">
                    <span>{b.name}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-1 mt-0.5">
                      {b.website}
                      {b.website !== "No Website" && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-600 dark:text-neutral-300">{b.industry}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    b.score >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    b.score >= 50 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                  }>
                    {b.score} / 100
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-neutral-200 dark:ring-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                    {b.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
