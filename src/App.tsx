import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import WorkOrders from './pages/WorkOrders';
import Inventory from './pages/Inventory';
import Financial from './pages/Financial';
import Burials from './pages/Burials';
import Contracts from './pages/Contracts';
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
        <Route path="inventory" element={<Inventory />} />
        <Route path="financial" element={<Financial />} />
        <Route path="burials" element={<Burials />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="grants" element={<Grants />} />
        <Route path="customers" element={<Customers />} />
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
