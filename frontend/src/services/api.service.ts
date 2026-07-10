import { api } from '../lib/api'

// ─── Types ──────────────────────────────────────────────────────────────────
export type WebsiteStatus = 'UNKNOWN' | 'NO_WEBSITE' | 'OUTDATED' | 'MODERN'
export type Stage =
  | 'RESEARCH' | 'AUDIT_COMPLETE' | 'CONTACTED' | 'MEETING_SCHEDULED'
  | 'DEMO_PRESENTED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST'

export interface Business {
  id: string
  name: string
  industry?: string
  website?: string
  websiteStatus: WebsiteStatus
  facebook?: string
  instagram?: string
  linkedin?: string
  address?: string
  county?: string
  town?: string
  opportunityScore: number
  stage: Stage
  notes?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  ownerId: string
  contacts?: Contact[]
  _count?: { interactions: number; tasks: number }
}

export interface Contact {
  id: string
  name: string
  position?: string
  phone?: string
  whatsapp?: string
  email?: string
  businessId: string
}

export interface Interaction {
  id: string
  type: string
  date: string
  notes?: string
  outcome?: string
  nextAction?: string
  businessId: string
  userId: string
  user?: { id: string; name: string }
  business?: { id: string; name: string }
}

export interface Audit {
  id: string;
  businessId: string;
  score: number;
  sections: any; // JSON
  createdAt: string;
}

export interface Proposal {
  id: string;
  businessId: string;
  title: string;
  content: string;
  value: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  business?: { id: string; name: string };
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  completed: boolean
  businessId?: string
  business?: { name: string }
}

export interface DashboardStats {
  totalLeads: number
  activeOpportunities: number
  wonDeals: number
  lostDeals: number
  proposalsSent: number
  recentInteractions: Interaction[]
  upcomingTasks: Task[]
}

// ─── API functions ───────────────────────────────────────────────────────────
export const businessApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ success: boolean; data: Business[]; meta: { total: number; page: number; limit: number } }>('/businesses', { params }),
  getById: (id: string) => api.get<{ success: boolean; data: Business }>(`/businesses/${id}`),
  create: (data: Partial<Business> & { contacts?: Partial<Contact>[] }) =>
    api.post<{ success: boolean; data: Business }>('/businesses', data),
  update: (id: string, data: Partial<Business>) =>
    api.patch<{ success: boolean; data: Business }>(`/businesses/${id}`, data),
  updateStage: (id: string, stage: Stage) =>
    api.patch<{ success: boolean; data: Business }>(`/businesses/${id}/stage`, { stage }),
  delete: (id: string) => api.delete(`/businesses/${id}`),
}

export const pipelineApi = {
  getAll: () => api.get<{ success: boolean; data: Record<Stage, Business[]>; stages: Stage[] }>('/pipeline'),
  moveCard: (id: string, stage: Stage) =>
    api.patch<{ success: boolean; data: Business }>(`/pipeline/${id}/move`, { stage }),
}

export const auditApi = {
  getLatest: (businessId: string) => api.get(`/audits/${businessId}`),
  create: (businessId: string, sections: any) => api.post(`/audits/${businessId}`, { sections })
}

export const proposalApi = {
  getAll: (businessId?: string) => api.get('/proposals', { params: { businessId } }),
  getById: (id: string) => api.get(`/proposals/${id}`),
  create: (data: Partial<Proposal>) => api.post('/proposals', data),
  update: (id: string, data: Partial<Proposal>) => api.patch(`/proposals/${id}`, data),
  delete: (id: string) => api.delete(`/proposals/${id}`)
}

export const interactionApi = {
  getByBusiness: (businessId: string) =>
    api.get<{ success: boolean; data: Interaction[] }>('/interactions', { params: { businessId } }),
  create: (data: Partial<Interaction>) =>
    api.post<{ success: boolean; data: Interaction }>('/interactions', data),
}

export const dashboardApi = {
  getStats: () => api.get<{ success: boolean; data: DashboardStats }>('/dashboard'),
}
