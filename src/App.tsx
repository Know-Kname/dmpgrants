import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkOrders from './pages/WorkOrders';
import Grants from './pages/Grants';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
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
        <Route path="inventory" element={<div className="text-2xl">Inventory (Coming Soon)</div>} />
        <Route path="financial" element={<div className="text-2xl">Financial (Coming Soon)</div>} />
        <Route path="burials" element={<div className="text-2xl">Burials (Coming Soon)</div>} />
        <Route path="contracts" element={<div className="text-2xl">Contracts (Coming Soon)</div>} />
        <Route path="grants" element={<Grants />} />
        <Route path="customers" element={<div className="text-2xl">Customers (Coming Soon)</div>} />
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
