import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { businessApi } from '@/services/api.service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { key: 'design', label: 'Visual Design & Branding', desc: 'Logo, colors, professional look and feel' },
  { key: 'ux', label: 'User Experience (UX)', desc: 'Navigation clarity, ease of use, user flow' },
  { key: 'performance', label: 'Page Speed & Performance', desc: 'Load time, image optimization, Core Web Vitals' },
  { key: 'mobile', label: 'Mobile Responsiveness', desc: 'Layout on phones and tablets' },
  { key: 'seo', label: 'Search Engine Optimization', desc: 'Meta tags, keywords, structured data' },
  { key: 'security', label: 'Security & Trust Signals', desc: 'SSL, privacy policy, trust badges, reviews' },
  { key: 'content', label: 'Content Quality', desc: 'Clear messaging, grammar, value proposition' },
  { key: 'cta', label: 'Calls-to-Action', desc: 'Book now, contact forms, WhatsApp buttons' },
  { key: 'leadGen', label: 'Lead Generation', desc: 'Email capture, lead magnets, offers' },
]

function ScoreSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-blue-500' : value >= 25 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-blue-600 h-2 cursor-pointer"
        />
        <div className={cn('w-10 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0', color)}>
          {value}
        </div>
      </div>
      <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function AuditForm() {
  const { businessId } = useParams<{ businessId: string }>()
  const navigate = useNavigate()

  const { data: biz } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => businessApi.getById(businessId!).then(r => r.data.data),
    enabled: !!businessId,
  })

  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(SECTIONS.map(s => [s.key, 50]))
  )

  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / SECTIONS.length
  )

  const overallColor = overallScore >= 75 ? 'text-emerald-600' : overallScore >= 50 ? 'text-blue-600' : overallScore >= 25 ? 'text-amber-600' : 'text-red-600'

  const submitMutation = useMutation({
    mutationFn: () =>
      api.post('/audits', { businessId, sections: scores }),
    onSuccess: () => {
      toast.success('Audit saved successfully!')
      navigate(`/businesses/${businessId}`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to={businessId ? `/businesses/${businessId}` : '/businesses'} className="mt-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Website Audit</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {biz ? `Auditing: ${biz.name}` : 'Score each area from 0 to 100'}
          </p>
        </div>
      </div>

      {/* Overall Score Banner */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-5 flex items-center gap-6">
          <div className={cn('text-6xl font-black tabular-nums', overallColor)}>{overallScore}</div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Overall Score</p>
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', overallScore >= 75 ? 'bg-emerald-500' : overallScore >= 50 ? 'bg-blue-500' : overallScore >= 25 ? 'bg-amber-500' : 'bg-red-500')}
                initial={{ width: 0 }}
                animate={{ width: `${overallScore}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {overallScore >= 75 ? 'Great – minimal intervention needed' : overallScore >= 50 ? 'Average – targeted improvements recommended' : 'Poor – strong case for a new website'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="space-y-3">
        {SECTIONS.map((section, idx) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  {section.label}
                  {scores[section.key] >= 75 && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </CardTitle>
                <p className="text-xs text-neutral-500">{section.desc}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ScoreSlider
                  value={scores[section.key]}
                  onChange={v => setScores(prev => ({ ...prev, [section.key]: v }))}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pb-8">
        <Button
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold"
        >
          {submitMutation.isPending ? 'Saving Audit…' : `Save Audit (Score: ${overallScore}/100)`}
        </Button>
        <Button variant="outline" asChild className="border-neutral-200 dark:border-neutral-800">
          <Link to={businessId ? `/businesses/${businessId}` : '/businesses'}>Cancel</Link>
        </Button>
      </div>
    </div>
  )
}
