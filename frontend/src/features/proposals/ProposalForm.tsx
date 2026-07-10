import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { businessApi, proposalApi, Proposal } from '@/services/api.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Printer, Plus, Trash2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface Section {
  id: string
  title: string
  content: string
}

export default function ProposalForm() {
  const { businessId, id: proposalId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isEdit = !!proposalId

  const { data: business } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => businessApi.getById(businessId!).then(res => res.data.data),
    enabled: !!businessId && !isEdit
  })

  const { data: existingProposal } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => proposalApi.getById(proposalId!).then(res => res.data.data),
    enabled: isEdit
  })

  const [title, setTitle] = useState('Website Redesign & Lead Gen Proposal')
  const [value, setValue] = useState(5000)
  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: 'Executive Summary', content: 'We propose a complete overhaul of your digital presence...' },
    { id: '2', title: 'Scope of Work', content: '- Custom UI/UX Design\n- Responsive Development\n- SEO Optimization' },
    { id: '3', title: 'Investment', content: 'Total investment: £5,000' }
  ])

  useEffect(() => {
    if (existingProposal) {
      setTitle(existingProposal.title)
      setValue(existingProposal.value)
      try {
        setSections(JSON.parse(existingProposal.content))
      } catch (e) {
        setSections([{ id: '1', title: 'Content', content: existingProposal.content }])
      }
    }
  }, [existingProposal])

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        title,
        value,
        content: JSON.stringify(sections),
        businessId: businessId || existingProposal?.businessId
      }
      if (isEdit) return proposalApi.update(proposalId!, data)
      return proposalApi.create(data)
    },
    onSuccess: () => {
      toast.success(`Proposal ${isEdit ? 'updated' : 'created'}`)
      qc.invalidateQueries({ queryKey: ['proposals'] })
      qc.invalidateQueries({ queryKey: ['business'] })
      navigate(-1)
    },
    onError: (err: any) => toast.error(err.message)
  })

  const handlePrint = () => window.print()

  const bizName = business?.name || existingProposal?.business?.name || 'Client'

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header (No print) */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-neutral-500">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isEdit ? 'Edit Proposal' : 'New Proposal'}
            </h1>
            <p className="text-sm text-neutral-500">For {bizName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Print PDF
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Save className="h-4 w-4" /> Save Proposal
          </Button>
        </div>
      </div>

      {/* Editor / Print Area */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm print:border-none print:shadow-none print:bg-white overflow-hidden">
        
        {/* Cover Page */}
        <div className="p-12 border-b border-neutral-200 dark:border-neutral-800 print:h-[1056px] print:flex print:flex-col print:justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center print:bg-blue-600 print:text-white">
              <FileText className="h-10 w-10" />
            </div>
            <div>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="text-4xl font-black text-center text-neutral-900 dark:text-white border-none bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-600 dark:hover:bg-neutral-800/50 dark:focus:bg-neutral-900 print:text-500 print:p-0 px-0 h-auto"
              />
            </div>
            <div className="text-xl text-neutral-500 print:text-neutral-600">
              Prepared for <strong className="text-neutral-900 dark:text-white print:text-black">{bizName}</strong>
            </div>
            <div className="text-sm text-neutral-400 print:text-neutral-500">
              {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            <div className="pt-12 flex justify-center items-center gap-4 print:hidden">
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Value: £</span>
                <input 
                  type="number" 
                  value={value} 
                  onChange={e => setValue(Number(e.target.value))}
                  className="bg-transparent border-none text-neutral-900 dark:text-white font-bold w-24 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-8 md:p-12 space-y-12 print:p-0 print:space-y-8 print:block">
          {sections.map((section, idx) => (
            <div key={section.id} className="relative group">
              <button 
                onClick={() => setSections(s => s.filter((_, i) => i !== idx))}
                className="absolute -right-4 -top-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <Input
                value={section.title}
                onChange={e => setSections(s => {
                  const n = [...s]; n[idx].title = e.target.value; return n;
                })}
                className="text-2xl font-bold text-neutral-900 dark:text-white border-none bg-transparent px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 print:p-0 print:mb-4 h-auto focus-visible:ring-1 focus-visible:ring-blue-600"
              />
              
              <textarea
                value={section.content}
                onChange={e => setSections(s => {
                  const n = [...s]; n[idx].content = e.target.value; return n;
                })}
                className="w-full min-h-[150px] mt-4 bg-transparent border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 focus:border-blue-600 dark:focus:border-blue-600 rounded-lg p-3 text-neutral-600 dark:text-neutral-300 print:text-black print:border-none print:p-0 resize-none outline-none transition-colors"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 print:hidden text-center">
            <Button 
              variant="outline" 
              onClick={() => setSections(s => [...s, { id: Date.now().toString(), title: 'New Section', content: '' }])}
              className="gap-2 border-dashed"
            >
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
