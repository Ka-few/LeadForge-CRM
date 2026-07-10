import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Building2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { businessApi, Business, Stage } from '@/services/api.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const STAGES: Stage[] = [
  'RESEARCH', 'AUDIT_COMPLETE', 'CONTACTED', 'MEETING_SCHEDULED',
  'DEMO_PRESENTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'
]

const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  position: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional()
})

const formSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  town: z.string().optional(),
  county: z.string().optional(),
  stage: z.enum(['RESEARCH', 'AUDIT_COMPLETE', 'CONTACTED', 'MEETING_SCHEDULED', 'DEMO_PRESENTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']),
  contacts: z.array(contactSchema).optional()
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onClose: () => void
  business?: Business | null
}

export default function BusinessFormModal({ open, onClose, business }: Props) {
  const qc = useQueryClient()
  const isEdit = !!business

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { stage: 'RESEARCH', contacts: [] }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' })

  useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({
          name: business.name,
          website: business.website || '',
          industry: business.industry || '',
          town: business.town || '',
          county: business.county || '',
          stage: business.stage,
          contacts: business.contacts?.map(c => ({
            id: c.id, name: c.name, position: c.position || '', email: c.email || '', phone: c.phone || ''
          })) || []
        })
      } else {
        reset({ name: '', website: '', industry: '', town: '', county: '', stage: 'RESEARCH', contacts: [] })
      }
    }
  }, [open, isEdit, business, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => isEdit ? businessApi.update(business.id, data) : businessApi.create(data),
    onSuccess: () => {
      toast.success(`Business ${isEdit ? 'updated' : 'added'} successfully`)
      qc.invalidateQueries({ queryKey: ['businesses'] })
      if (isEdit) qc.invalidateQueries({ queryKey: ['business', business.id] })
      onClose()
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const onSubmit = (data: FormValues) => {
    // Clean empty strings
    if (!data.website) data.website = undefined
    data.contacts = data.contacts?.map(c => ({
      ...c,
      email: c.email || undefined,
      position: c.position || undefined,
      phone: c.phone || undefined
    }))
    mutation.mutate(data)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white dark:bg-neutral-950 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {isEdit ? 'Edit Business' : 'Add New Business'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {isEdit ? 'Update company details and contacts' : 'Create a new lead profile'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="biz-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Company Details</h3>
                  
                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Company Name *</label>
                    <Input {...register('name')} placeholder="e.g. Acme Corp" className={cn("mt-1.5", errors.name && "border-red-500")} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Website</label>
                      <Input {...register('website')} placeholder="https://..." className={cn("mt-1.5", errors.website && "border-red-500")} />
                      {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Industry</label>
                      <Input {...register('industry')} placeholder="e.g. Real Estate" className="mt-1.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Town / City</label>
                      <Input {...register('town')} placeholder="e.g. London" className="mt-1.5" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">County / State</label>
                      <Input {...register('county')} placeholder="e.g. Greater London" className="mt-1.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Pipeline Stage</label>
                    <select {...register('stage')} className="mt-1.5 w-full h-10 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white outline-none focus-visible:ring-1 focus-visible:ring-blue-600">
                      {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>

                {/* Contacts */}
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Key Contacts</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', position: '', email: '', phone: '' })} className="h-8 gap-1.5 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add Contact
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-3 relative group">
                        <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3 pr-6">
                          <div>
                            <Input {...register(`contacts.${index}.name`)} placeholder="Full Name *" className={cn("h-9", errors.contacts?.[index]?.name && "border-red-500")} />
                            {errors.contacts?.[index]?.name && <p className="text-xs text-red-500 mt-1">{errors.contacts[index]?.name?.message}</p>}
                          </div>
                          <div>
                            <Input {...register(`contacts.${index}.position`)} placeholder="Job Title" className="h-9" />
                          </div>
                          <div>
                            <Input {...register(`contacts.${index}.email`)} placeholder="Email Address" type="email" className={cn("h-9", errors.contacts?.[index]?.email && "border-red-500")} />
                            {errors.contacts?.[index]?.email && <p className="text-xs text-red-500 mt-1">{errors.contacts[index]?.email?.message}</p>}
                          </div>
                          <div>
                            <Input {...register(`contacts.${index}.phone`)} placeholder="Phone Number" className="h-9" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-sm text-neutral-500 italic text-center py-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        No contacts added yet.
                      </p>
                    )}
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" form="biz-form" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                {mutation.isPending ? 'Saving...' : 'Save Business'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
