import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal, Button } from './ui';
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleConfirm = async () => {
    if (!options) return;

    try {
      setIsLoading(true);
      await options.onConfirm();
      setIsOpen(false);
      setOptions(null);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    setIsOpen(false);
    setOptions(null);
  };

  const icons = {
    danger: <Trash2 className="text-red-600" size={48} />,
    warning: <AlertTriangle className="text-yellow-600" size={48} />,
    info: <Info className="text-blue-600" size={48} />,
    success: <CheckCircle className="text-green-600" size={48} />,
  };

  const iconBg = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    success: 'bg-green-100',
  };

  const variant = options?.variant || 'warning';

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={options?.title || 'Confirm Action'}
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {options?.cancelText || 'Cancel'}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : options?.confirmText || 'Confirm'}
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 ${iconBg[variant]} rounded-full flex items-center justify-center mb-4`}>
            {icons[variant]}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {options?.message}
          </p>
        </div>
      </Modal>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }
  return context;
}
