import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Lock, Mail, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Account created! Welcome to LeadForge.')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 text-white mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">LF</div>
          <span className="font-bold text-lg">LeadForge</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
        <p className="text-neutral-400 mb-8 text-sm">Start managing your leads today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', icon: User, value: name, set: setName, type: 'text', placeholder: 'John Doe' },
            { label: 'Email', icon: Mail, value: email, set: setEmail, type: 'email', placeholder: 'you@company.com' },
            { label: 'Password', icon: Lock, value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
          ].map(({ label, icon: Icon, value, set, type, placeholder }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  className="pl-10 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-blue-600 h-10"
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium gap-2 mt-2"
            disabled={loading}
          >
            {loading ? 'Creating account…' : <><span>Get started</span><ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
