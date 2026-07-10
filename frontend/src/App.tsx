import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import Dashboard from "./features/dashboard/Dashboard"
import Businesses from "./features/businesses/Businesses"
import Pipeline from "./features/crm/Pipeline"
import PageWrapper from "./components/layout/PageWrapper"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
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
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/pipeline" element={<Pipeline />} />
          </Routes>
        </PageWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
