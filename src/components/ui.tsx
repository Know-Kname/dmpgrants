import React from 'react';

// Helper to merge class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-secondary-700 border border-secondary-200 hover:bg-secondary-50 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-600',
    outline: 'bg-transparent border border-secondary-200 text-secondary-700 hover:bg-secondary-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-soft border border-secondary-100',
      hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : '',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-b border-secondary-100', className)}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    success: 'bg-green-50 text-green-700 border border-green-100',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
    gray: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col animate-slide-up', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100">
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-lg hover:bg-secondary-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-secondary-100 flex justify-end space-x-3 bg-secondary-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors">{icon}</div>}
        <input
          className={cn(
            'w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all duration-200 bg-white placeholder:text-secondary-400',
            icon ? 'pl-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-red-600" />
        {error}
      </p>}
    </div>
  );
}

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            'w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all duration-200 bg-white appearance-none',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '',
            className
          )}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>}
      <textarea
        className={cn(
          'w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all duration-200 resize-none placeholder:text-secondary-400',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '',
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-secondary-200 bg-secondary-50/50">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-secondary-100 text-secondary-400 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn('border-4 border-secondary-200 border-t-primary-600 rounded-full animate-spin', sizes[size])} />
    </div>
  );
}
