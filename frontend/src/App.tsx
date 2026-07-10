import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/layout/PrivateRoute"
import PageWrapper from "./components/layout/PageWrapper"

// Auth
import LoginPage from "./features/auth/LoginPage"
import RegisterPage from "./features/auth/RegisterPage"

// App pages
import Dashboard from "./features/dashboard/Dashboard"
import Businesses from "./features/businesses/Businesses"
import BusinessProfile from "./features/businesses/BusinessProfile"
import Pipeline from "./features/crm/Pipeline"
import Tasks from "./features/tasks/Tasks"
import Reports from "./features/reports/Reports"
import AuditForm from "./features/audit/AuditForm"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #27272a',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/*" element={
              <PrivateRoute>
                <PageWrapper>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/businesses" element={<Businesses />} />
                    <Route path="/businesses/:id" element={<BusinessProfile />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/audit/:businessId" element={<AuditForm />} />
                  </Routes>
                </PageWrapper>
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
