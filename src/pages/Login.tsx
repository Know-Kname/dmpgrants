import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button, Input } from '../components/ui';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24 animate-fade-in">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary-900">Welcome back</h1>
            <p className="text-secondary-500">
              Enter your credentials to access the management system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 animate-slide-up">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                icon={<Mail size={18} />}
                disabled={isLoading}
              />
              
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  icon={<Lock size={18} />}
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
              icon={!isLoading && <ArrowRight size={18} />}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="pt-6 border-t border-secondary-100">
            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
              <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-2">Demo Credentials</p>
              <div className="flex items-center justify-between text-sm text-secondary-700">
                <span>admin@dmp.com</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-secondary-200 select-all">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Feature */}
      <div className="hidden lg:flex flex-1 bg-secondary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Detroit Memorial Park</h2>
            <p className="text-primary-200">Established 1925</p>
          </div>

          <div className="space-y-8 max-w-lg">
            <blockquote className="text-2xl font-medium leading-relaxed">
              "Providing dignified and respectful services to our community for over a century."
            </blockquote>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-primary-100">
                <CheckCircle2 className="text-primary-400" />
                <span>Comprehensive Record Management</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-100">
                <CheckCircle2 className="text-primary-400" />
                <span>Interactive Mapping Systems</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-100">
                <CheckCircle2 className="text-primary-400" />
                <span>Seamless Work Order Tracking</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-secondary-400">
            <span>© 2025 DMP Cemetery Management System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
