# 🎯 Quick Reference Card - Frontend API

## Import Statements

```tsx
// Option 1: Hooks (Recommended)
import { 
  useFormsFetch, 
  useFormCreate, 
  useFormUpdate, 
  useFormDelete,
  useFormById 
} from './hooks/useForm';

// Option 2: Direct API
import { formAPI, systemAPI } from './api';

// Option 3: Types
import { 
  FormFilledCreate, 
  FormFilledUpdate, 
  FormFilledResponse 
} from './api';
```

## Fetch All Forms (Hook)

```tsx
const { data, loading, error, refetch } = useFormsFetch();
```

## Fetch Single Form (Hook)

```tsx
const { data: form, loading, error } = useFormById(formId);
```

## Create Form (Hook)

```tsx
const { createForm, loading, error, success } = useFormCreate();
await createForm({ user_type, user_name, user_city, user_country });
```

## Update Form (Hook)

```tsx
const { updateForm, loading, error } = useFormUpdate();
await updateForm(formId, { user_city: 'New City' });
```

## Delete Form (Hook)

```tsx
const { deleteForm, loading, error } = useFormDelete();
await deleteForm(formId);
```

## Direct API Calls

```tsx
// Create
const form = await formAPI.create({ /* data */ });

// Get all
const forms = await formAPI.getAll();

// Get by ID
const form = await formAPI.getById(id);

// Update
const updated = await formAPI.update(id, { /* data */ });

// Delete
await formAPI.delete(id);
```

## Form Fields

```tsx
{
  user_type: string,           // Required
  user_name: string,           // Required
  user_city: string,           // Required
  user_country: string,        // Required
  school_type?: string,        // Optional
  user_msg?: string            // Optional
}
```

## Response Object

```tsx
{
  id: string,                  // UUID
  user_type: string,
  user_name: string,
  user_city: string,
  user_country: string,
  school_type: string | null,
  user_msg: string | null,
  created_at: string,          // ISO date
  updated_at: string           // ISO date
}
```

## Error Handling

```tsx
try {
  await formAPI.create(data);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

## Basic Component

```tsx
import { useFormsFetch } from './hooks/useForm';

export function MyComponent() {
  const { data, loading, error } = useFormsFetch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data.map(form => (
        <div key={form.id}>{form.user_name}</div>
      ))}
    </div>
  );
}
```

## Form Submission

```tsx
import { useState } from 'react';
import { useFormCreate } from './hooks/useForm';
import { FormFilledCreate } from './api';

export function FormPage() {
  const [data, setData] = useState<FormFilledCreate>({
    user_type: '', user_name: '', user_city: '', user_country: ''
  });
  const { createForm, loading, error } = useFormCreate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createForm(data);
      // Success
    } catch (err) {
      // Error
    }
  };

  return (
    <form onSubmit={submit}>
      <input onChange={e => setData({...data, user_name: e.target.value})} />
      <button disabled={loading}>Submit</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

## Endpoints

| Method | Path | Hook | Direct |
|--------|------|------|--------|
| POST | `/form/` | `useFormCreate()` | `formAPI.create()` |
| GET | `/form/` | `useFormsFetch()` | `formAPI.getAll()` |
| GET | `/form/{id}` | `useFormById()` | `formAPI.getById()` |
| PUT | `/form/{id}` | `useFormUpdate()` | `formAPI.update()` |
| DELETE | `/form/{id}` | `useFormDelete()` | `formAPI.delete()` |

## Env Variables

```env
VITE_API_URL=http://localhost:8000
```

## Check Backend

```tsx
import { systemAPI } from './api';

const health = await systemAPI.health();
// { healthy: true, db: "ok" }
```

## Common Patterns

### List & Refetch
```tsx
const { data, refetch } = useFormsFetch();
<button onClick={refetch}>Refresh</button>
```

### List & Delete
```tsx
const { data, refetch } = useFormsFetch();
const { deleteForm } = useFormDelete();

const remove = async (id: string) => {
  await deleteForm(id);
  refetch();
};
```

### List & Edit
```tsx
const { data } = useFormsFetch();
const { updateForm } = useFormUpdate();

const edit = async (id: string, newData: Partial<FormFilledCreate>) => {
  await updateForm(id, newData);
};
```

---

**More examples**: See `API_USAGE.md` and `FRONTEND_SETUP.md`
