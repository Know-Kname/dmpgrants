import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider, LoadingSpinner } from './components/ui';
import ErrorBoundary from './components/ErrorBoundary';
import { ConfirmDialogProvider } from './components/ConfirmDialog';
import Layout from './components/Layout';

// Lazy load pages for code splitting and better performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Grants = lazy(() => import('./pages/Grants'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <AppRoutes />
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
