import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useState } from 'react';
import {
  Home, FileText, Package, DollarSign, Users,
  FileSignature, Gift, ClipboardList, LogOut, User, Menu, X
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: DollarSign, label: 'Financial', path: '/financial' },
    { icon: Users, label: 'Burials', path: '/burials' },
    { icon: FileSignature, label: 'Contracts', path: '/contracts' },
    { icon: Gift, label: 'Grants', path: '/grants' },
    { icon: FileText, label: 'Customers', path: '/customers' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DMP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Detroit Memorial Park</h1>
                <p className="text-xs text-gray-500">Cemetery Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-700" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-auto
            ${isSidebarOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} className={active ? 'text-primary-600' : ''} />
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Footer inside sidebar for mobile */}
            <div className="mt-auto pt-8 pb-4">
               <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Version 1.0.0</div>
                  <div>© 2025 DMP Cemetery</div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
