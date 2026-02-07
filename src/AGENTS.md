# Frontend Agent Guide (src/)

All code in this directory is **TypeScript** (strict mode). Files must be `.ts` or `.tsx`.

## Key Files to Read First

1. `types/index.ts` -- every domain entity interface
2. `lib/api.ts` -- API client (auto camelCase/snake_case conversion)
3. `lib/schemas.ts` -- all Zod form validation schemas
4. `components/ui.tsx` -- the entire UI component library
5. `lib/auth.tsx` -- auth context, `useAuth()` hook, `isAuthenticated`, `isDemo`

## Rules

- **Imports**: Use `@/` alias for all cross-directory imports (e.g., `import { api } from '@/lib/api'`).
- **Components**: Only use UI components from `components/ui.tsx`. Do not add external component libraries.
- **Colors**: Use semantic tokens (`bg-card`, `text-foreground`, `border-border`). Never use raw Tailwind colors.
- **Data fetching**: Use `useData` hook or React Query (`useQuery`/`useMutation`). Never `useEffect` + `fetch`.
- **Forms**: Use the `useForm` hook from `hooks/useForm.ts` with Zod schemas from `lib/schemas.ts`.
- **Types**: All domain interfaces go in `types/index.ts`. Use `camelCase` for all properties.
- **Unused variables**: Strict mode rejects them. Prefix intentionally unused params with `_`.

## Testing

- Test framework: Vitest + jsdom + React Testing Library.
- Globals enabled: `describe`, `it`, `expect`, `vi` are available without imports.
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`.
- Setup: `tests/setup.ts` polyfills `localStorage`, `matchMedia`, `scrollTo`.

## Patterns

### Creating a new page

1. Create `pages/NewPage.tsx` using `WorkOrders.tsx` or `Grants.tsx` as a template.
2. Add route in `App.tsx` inside the `ProtectedRoute` wrapper.
3. Add navigation link in `components/Layout.tsx`.
4. Add types to `types/index.ts`, schema to `lib/schemas.ts`.

### API calls

```typescript
import { api } from '@/lib/api';

// GET with params -- response is auto-converted to camelCase
const data = await api.get<PaginatedResponse<WorkOrder>>('/work-orders', {
  params: { page: 1, limit: 25, status: 'pending' },
});

// POST -- body is auto-converted to snake_case
await api.post('/work-orders', {
  title: 'Fix headstone',  // sent as "title" (already snake_case-safe)
  dueDate: '2026-03-01',   // sent as "due_date"
});
```

### Error handling in UI

```typescript
import { getErrorMessage } from '@/lib/api';

try {
  await api.post('/work-orders', formData);
} catch (err) {
  setError(getErrorMessage(err)); // user-friendly message
}
```
