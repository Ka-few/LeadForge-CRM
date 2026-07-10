import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./features/dashboard/Dashboard"
import Businesses from "./features/businesses/Businesses"
import Pipeline from "./features/crm/Pipeline"
import PageWrapper from "./components/layout/PageWrapper"

function App() {
  return (
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
  )
}

export default App
