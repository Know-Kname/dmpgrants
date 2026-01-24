# 📱 Frontend Boilerplate Guide

Complete guide to the production-ready React + TypeScript frontend.

## 🏗️ Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui.tsx                  # UI component library
│   │   ├── Layout.tsx              # App layout with sidebar
│   │   ├── ErrorBoundary.tsx       # Error crash prevention
│   │   └── ConfirmDialog.tsx       # Confirmation modals
│   ├── hooks/
│   │   ├── useDebounce.ts          # Debounce hook
│   │   ├── useFormValidation.ts    # Form validation
│   │   └── useKeyboard.ts          # Keyboard shortcuts
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   └── auth.tsx                # Auth context
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   └── Dashboard.tsx           # Dashboard page
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 Components

### UI Component Library (`components/ui.tsx`)

Pre-built components following best practices:

#### Button
```tsx
<Button variant="primary" size="md" icon={<Plus />} onClick={handleClick}>
  Create Item
</Button>
```

**Variants:** primary, secondary, success, danger, ghost
**Sizes:** sm, md, lg

#### Card
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content here</CardBody>
</Card>
```

#### Modal
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Create Item"
  footer={<Button>Save</Button>}
>
  {/* Modal content */}
</Modal>
```

**Features:**
- Escape key to close
- Body scroll lock
- Backdrop click to close
- Customizable size (sm, md, lg, xl)

#### Input / Select / Textarea
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Features:**
- Built-in error display
- Optional icon support
- Label and placeholder

#### Toast Notifications
```tsx
import { useToast } from './components/ui';

function MyComponent() {
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('success', 'Item saved successfully!');
  };
}
```

**Variants:** success, error, warning, info
**Features:** Auto-dismiss, slide-in animation, stacking

#### Confirmation Dialogs
```tsx
import { useConfirm } from './components/ConfirmDialog';

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = () => {
    confirm({
      title: 'Delete Item',
      message: 'Are you sure? This cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        await deleteItem();
      }
    });
  };
}
```

**Variants:** danger, warning, info, success

---

## 🪝 Custom Hooks

### useDebounce
Debounce any value (great for search):

```tsx
import { useDebounce } from '../hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    // Only runs 300ms after user stops typing
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
}
```

### useFormValidation
Form validation with rules:

```tsx
import { useFormValidation } from '../hooks/useFormValidation';

function MyForm() {
  const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    {
      email: {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email format'
        }
      },
      password: {
        required: true,
        minLength: { value: 8, message: 'Minimum 8 characters' }
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        value={values.email}
        error={errors.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
      />
    </form>
  );
}
```

### useKeyboard
Keyboard shortcuts:

```tsx
import { useKeyboard } from '../hooks/useKeyboard';

function MyComponent() {
  useKeyboard('Escape', () => {
    closeModal();
  });

  useKeyboardCombo(
    { ctrl: true, key: 's' },
    (e) => {
      e.preventDefault();
      saveData();
    }
  );
}
```

---

## 🔌 API Client

The API client (`lib/api.ts`) includes:

### Features
- ✅ Automatic authentication headers
- ✅ Error handling with custom ApiError class
- ✅ Request timeout (30s default)
- ✅ Session expiry handling (401 → redirect)
- ✅ Network error detection
- ✅ TypeScript generic support

### Usage
```tsx
import { api, ApiError } from '../lib/api';

// GET request
const users = await api.get<User[]>('/users');

// POST request
const newUser = await api.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});

// Error handling
try {
  await api.delete(`/users/${id}`);
  showToast('success', 'User deleted');
} catch (error) {
  if (error instanceof ApiError) {
    showToast('error', error.message);
  }
}
```

### Error Responses
- **401** - Session expired, redirects to login
- **403** - Permission denied
- **404** - Resource not found
- **422** - Validation failed
- **500+** - Server error
- **Network** - Connection error
- **Timeout** - Request took too long

---

## 🔐 Authentication

### Auth Context (`lib/auth.tsx`)

```tsx
import { useAuth } from '../lib/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Protected Routes
```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

---

## 🎨 Styling

### Tailwind CSS
The boilerplate includes:
- ✅ Tailwind CSS 3.4+
- ✅ Custom color palette
- ✅ Responsive design utilities
- ✅ Custom animations

### Customization
Edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#0284c7',
          // ... more shades
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      }
    }
  }
}
```

---

## 🚀 Performance

### Code Splitting
Routes are lazy loaded:

```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
```

### React.memo
Expensive components are memoized:

```tsx
const StatCard = React.memo(({ title, value }) => {
  return <Card>{/* ... */}</Card>;
});
```

---

## 🧪 Best Practices

### 1. Always Handle Errors
```tsx
// ❌ Bad
const data = await api.get('/users');

// ✅ Good
try {
  const data = await api.get('/users');
  showToast('success', 'Data loaded');
} catch (error) {
  showToast('error', error.message);
}
```

### 2. Use Debounced Search
```tsx
// ❌ Bad - searches on every keystroke
onChange={(e) => fetchResults(e.target.value)}

// ✅ Good - debounced
const debouncedSearch = useDebounce(searchTerm, 300);
useEffect(() => fetchResults(debouncedSearch), [debouncedSearch]);
```

### 3. Provide User Feedback
```tsx
// ❌ Bad - no feedback
await deleteItem();

// ✅ Good - toast notification
await deleteItem();
showToast('success', 'Item deleted');
```

### 4. Use Confirmation for Destructive Actions
```tsx
// ❌ Bad - browser confirm
if (confirm('Delete?')) deleteItem();

// ✅ Good - custom dialog
confirm({
  title: 'Delete Item',
  message: 'Are you sure you want to delete "Item Name"?',
  variant: 'danger',
  onConfirm: deleteItem
});
```

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production
```bash
npm run preview
```

---

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- JSX: react-jsx
- ES2020 target

### Vite (`vite.config.ts`)
- React plugin
- Port: 5173
- Auto-open browser

### Tailwind (`tailwind.config.js`)
- Custom color palette
- Content paths configured
- Animations included

---

## 📝 Type Safety

All API responses have types:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

const users = await api.get<User[]>('/users');
// users is typed as User[]
```

---

## 🎯 Summary

This frontend boilerplate provides:
- ✅ Production-ready React + TypeScript
- ✅ Complete UI component library
- ✅ Custom hooks for common patterns
- ✅ Error handling throughout
- ✅ Toast notifications
- ✅ Form validation
- ✅ API client with timeout
- ✅ Authentication context
- ✅ Code splitting
- ✅ Tailwind CSS

Perfect foundation for any React application!
