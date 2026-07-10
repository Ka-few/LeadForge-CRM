import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, Building2 } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">LF</div>
            <span className="font-bold text-xl tracking-tight">LeadForge CRM</span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Turn every lead into<br />a closed deal.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Premium CRM for freelancers and agencies.<br />Track, score, and convert your best opportunities.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['1,284', 'Total Leads'], ['$142k', 'Pipeline Value'], ['92%', 'Satisfaction']].map(([v, l]) => (
            <div key={l} className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-white font-bold text-xl">{v}</div>
              <div className="text-blue-200 text-xs mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 text-white mb-10">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">LeadForge</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Sign in</h2>
          <p className="text-neutral-400 mb-8 text-sm">Enter your credentials to access your workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-blue-600 h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-blue-600 h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium gap-2 mt-2"
              disabled={loading}
            >
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-500">
            <p className="font-medium text-neutral-400 mb-1">Demo credentials</p>
            <p>demo@leadforge.com / password123</p>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
