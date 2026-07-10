import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Save, User, Building2, Mail, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const TABS = ['Profile', 'Company', 'Email Templates', 'WhatsApp'] as const
type Tab = typeof TABS[number]

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('Profile')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved successfully!')
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full md:w-56 flex-shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left',
                activeTab === tab
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {tab === 'Profile' && <User className="h-4 w-4" />}
              {tab === 'Company' && <Building2 className="h-4 w-4" />}
              {tab === 'Email Templates' && <Mail className="h-4 w-4" />}
              {tab === 'WhatsApp' && <MessageSquare className="h-4 w-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* PROFILE */}
          {activeTab === 'Profile' && (
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
                <p className="text-xs text-neutral-500">Update your personal details.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Full Name</label>
                    <Input defaultValue={user?.name} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Email Address</label>
                    <Input defaultValue={user?.email} disabled className="mt-1.5 bg-neutral-50 dark:bg-neutral-900/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">New Password</label>
                  <Input type="password" placeholder="Leave blank to keep current" className="mt-1.5" />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="h-4 w-4" /> Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* COMPANY */}
          {activeTab === 'Company' && (
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Company Settings</CardTitle>
                <p className="text-xs text-neutral-500">Details used in proposals and invoices.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-xs text-neutral-400 font-medium">Logo</span>
                  </div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Company Name</label>
                    <Input defaultValue="LeadForge Agency" className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Website</label>
                    <Input defaultValue="https://leadforge.io" className="mt-1.5" />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Business Address</label>
                  <textarea className="mt-1.5 w-full h-20 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-600 resize-none" defaultValue="123 Digital Ave&#10;London, UK&#10;EC1A 1BB" />
                </div>

                <div className="pt-2">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="h-4 w-4" /> Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TEMPLATES */}
          {(activeTab === 'Email Templates' || activeTab === 'WhatsApp') && (
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm border-dashed">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-4">
                  {activeTab === 'Email Templates' ? <Mail className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Coming Soon</h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                  We are building an advanced template editor for your {activeTab.toLowerCase()}. Check back in the next update.
                </p>
              </CardContent>
            </Card>
          )}
          
        </div>
      </div>
    </div>
  )
}
