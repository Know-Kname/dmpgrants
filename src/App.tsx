import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import Layout from './components/Layout';
import { Card, CardBody, EmptyState } from './components/ui';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkOrders from './pages/WorkOrders';
import Grants from './pages/Grants';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardBody>
        <EmptyState
          icon={<Clock size={48} />}
          title={`${title} is coming soon`}
          description={description}
        />
      </CardBody>
    </Card>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="work-orders" element={<WorkOrders />} />
        <Route
          path="inventory"
          element={<ComingSoon title="Inventory" description="Track stock levels, reorder points, and vendors." />}
        />
        <Route
          path="financial"
          element={<ComingSoon title="Financial" description="Review receivables, payables, and deposits in one place." />}
        />
        <Route
          path="burials"
          element={<ComingSoon title="Burials" description="Manage burial records, locations, and permits." />}
        />
        <Route
          path="contracts"
          element={<ComingSoon title="Contracts" description="Create and manage pre-need or at-need contracts." />}
        />
        <Route path="grants" element={<Grants />} />
        <Route
          path="customers"
          element={<ComingSoon title="Customers" description="Maintain contacts, families, and communication history." />}
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
