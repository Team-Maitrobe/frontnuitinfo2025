# 🚀 Frontend API Integration Guide

## Quick Setup

Your API is ready to use! Here's what's set up:

### Files Created:
- ✅ `src/api.tsx` - Fully typed API service
- ✅ `src/hooks/useForm.ts` - React hooks for data fetching
- ✅ `src/.env` - Environment configuration
- ✅ `.env.example` - Configuration template
- ✅ `src/API_USAGE.md` - Detailed usage guide

## 3-Minute Setup

### 1. Environment Configuration

Your `.env` file is already configured:
```env
VITE_API_URL=http://localhost:8000
```

For production, update it to your deployed backend URL.

### 2. Make Sure Backend is Running

```bash
# In the server directory
docker-compose up -d
```

Verify it's working: http://localhost:8000/docs

## Basic Usage

### Option A: Using the API Service (More Control)

```tsx
import { formAPI } from './api';

// Create a form
const newForm = await formAPI.create({
  user_type: 'student',
  user_name: 'Jean Dupont',
  user_city: 'Paris',
  user_country: 'France'
});

// Fetch all forms
const forms = await formAPI.getAll();

// Update a form
await formAPI.update(form.id, { user_city: 'Lyon' });

// Delete a form
await formAPI.delete(form.id);
```

### Option B: Using Hooks (Recommended for React)

```tsx
import { useFormsFetch, useFormCreate } from './hooks/useForm';

export function MyComponent() {
  const { data: forms, loading, error } = useFormsFetch();
  const { createForm } = useFormCreate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {forms.map(form => (
        <div key={form.id}>{form.user_name}</div>
      ))}
    </div>
  );
}
```

## Available Hooks

### `useFormsFetch()`
Fetches all forms automatically on mount.
```tsx
const { data, loading, error, refetch } = useFormsFetch();
```

### `useFormById(id)`
Fetches a specific form by ID.
```tsx
const { data: form, loading, error } = useFormById('form-id');
```

### `useFormCreate()`
Submit a new form.
```tsx
const { createForm, loading, error, success } = useFormCreate();
await createForm({ user_type: 'student', ... });
```

### `useFormUpdate()`
Update an existing form.
```tsx
const { updateForm, loading, error } = useFormUpdate();
await updateForm(formId, { user_name: 'New Name' });
```

### `useFormDelete()`
Delete a form.
```tsx
const { deleteForm, loading, error } = useFormDelete();
await deleteForm(formId);
```

## Form Submission Example

Complete form component:

```tsx
import { useFormCreate } from './hooks/useForm';
import { FormFilledCreate } from './api';
import { useState } from 'react';

export function FormPage() {
  const [formData, setFormData] = useState<FormFilledCreate>({
    user_type: '',
    user_name: '',
    user_city: '',
    user_country: '',
    school_type: '',
    user_msg: ''
  });

  const { createForm, loading, error, success } = useFormCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createForm(formData);
      console.log('Form submitted:', result.id);
      // Reset form or redirect
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">✓ Form submitted!</p>}

      <input
        placeholder="Type"
        value={formData.user_type}
        onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
        required
      />
      <input
        placeholder="Name"
        value={formData.user_name}
        onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
        required
      />
      <input
        placeholder="City"
        value={formData.user_city}
        onChange={(e) => setFormData({ ...formData, user_city: e.target.value })}
        required
      />
      <input
        placeholder="Country"
        value={formData.user_country}
        onChange={(e) => setFormData({ ...formData, user_country: e.target.value })}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Display Forms Example

```tsx
import { useFormsFetch } from './hooks/useForm';

export function FormsDisplay() {
  const { data: forms, loading, error, refetch } = useFormsFetch();

  if (loading) return <div>Loading forms...</div>;
  if (error) return <div>Error: {error}</div>;
  if (forms.length === 0) return <div>No forms found</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {forms.map((form) => (
        <div key={form.id} className="form-card">
          <h3>{form.user_name}</h3>
          <p>Type: {form.user_type}</p>
          <p>Location: {form.user_city}, {form.user_country}</p>
          {form.user_msg && <p>Message: {form.user_msg}</p>}
          <small>Created: {new Date(form.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
```

## Type Safety

All TypeScript types are exported:

```tsx
import {
  FormFilledCreate,      // For creating forms
  FormFilledUpdate,      // For partial updates
  FormFilledResponse,    // Complete form with ID and timestamps
} from './api';
```

## Error Handling

```tsx
try {
  await formAPI.create(data);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Handle error
  }
}
```

## API Endpoints Reference

| Method | Path | Function | Returns |
|--------|------|----------|---------|
| POST | `/form/` | Create | FormFilledResponse |
| GET | `/form/` | List all | FormFilledResponse[] |
| GET | `/form/{id}` | Get by ID | FormFilledResponse |
| PUT | `/form/{id}` | Update | FormFilledResponse |
| DELETE | `/form/{id}` | Delete | void |

## Environment Variables

**Development (.env):**
```env
VITE_API_URL=http://localhost:8000
```

**Production (.env.production):**
```env
VITE_API_URL=https://api.your-domain.com
```

## Testing the API

### 1. Direct Service Test
```tsx
import { systemAPI } from './api';

// Check backend health
const health = await systemAPI.health();
console.log(health); // { healthy: true, db: "ok" }
```

### 2. In Browser Console
```javascript
// Test form creation
const response = await fetch('http://localhost:8000/form/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_type: 'student',
    user_name: 'Test',
    user_city: 'Paris',
    user_country: 'France'
  })
});
console.log(await response.json());
```

## Common Issues & Solutions

### "Cannot fetch from API"
1. Check if backend is running: `docker-compose up -d` in server folder
2. Verify `VITE_API_URL` in `.env`
3. Check browser console for CORS errors

### "Module not found: api"
- Ensure `src/api.tsx` exists
- Check import path: `import { formAPI } from './api'`

### "Type error with FormFilledCreate"
- Import the type: `import { FormFilledCreate } from './api'`
- Ensure all required fields are provided

### "Backend responding with 404"
- Make sure routes are registered in backend
- Check backend is running: http://localhost:8000/docs
- Verify endpoint path is correct

## Next Steps

1. ✅ API is configured and ready
2. ✅ Types are defined
3. ✅ Hooks are available
4. Start building your components!

## Examples by Page

### Accueil (Home)
```tsx
import { systemAPI } from './api';

export function Accueil() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    systemAPI.status().then(s => setStatus(s.status));
  }, []);

  return <div>API Status: {status}</div>;
}
```

### Formulaire (Form)
See "Form Submission Example" above

### Liste (List)
See "Display Forms Example" above

## Support

- Full guide: See `src/API_USAGE.md`
- Backend docs: http://localhost:8000/docs
- TypeScript help: Hover over types in your IDE

Happy coding! 🎉
