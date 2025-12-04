# API Usage Guide for Frontend Team

## Setup

The API is already configured in `src/api.tsx`. The base URL is controlled by the `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Importing the API

```tsx
import { formAPI, systemAPI, FormFilledCreate, FormFilledResponse } from './api';
```

## Usage Examples

### 1. Create a Form

```tsx
import { formAPI, FormFilledCreate } from './api';

const handleSubmit = async (formData: FormFilledCreate) => {
  try {
    const response = await formAPI.create({
      user_type: "student",
      user_name: "John Doe",
      user_city: "Paris",
      user_country: "France",
      school_type: "Lycée",
      user_msg: "Interested in tech"
    });
    console.log('Form created:', response.id);
  } catch (error) {
    console.error('Failed to create form:', error);
  }
};
```

### 2. Get All Forms

```tsx
import { formAPI } from './api';
import { useEffect, useState } from 'react';

export function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formAPI.getAll();
        setForms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {forms.map((form) => (
        <div key={form.id}>
          <h3>{form.user_name}</h3>
          <p>Type: {form.user_type}</p>
          <p>City: {form.user_city}, {form.user_country}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Get a Specific Form

```tsx
import { formAPI } from './api';

const form = await formAPI.getById('550e8400-e29b-41d4-a716-446655440000');
console.log(form.user_name);
```

### 4. Update a Form

```tsx
import { formAPI } from './api';

const updatedForm = await formAPI.update(
  'form-id-here',
  {
    user_city: 'Lyon',
    user_msg: 'Updated message'
  }
);
```

### 5. Delete a Form

```tsx
import { formAPI } from './api';

await formAPI.delete('form-id-here');
```

### 6. Check API Health

```tsx
import { systemAPI } from './api';

const health = await systemAPI.health();
console.log(health); // { healthy: true, db: "ok" }
```

## React Hook Example (useEffect)

```tsx
import { formAPI, FormFilledResponse } from './api';
import { useEffect, useState } from 'react';

export function Formulaire() {
  const [forms, setForms] = useState<FormFilledResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const data = await formAPI.getAll();
        setForms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {forms.map((form) => (
        <div key={form.id}>
          <h4>{form.user_name}</h4>
          <p>{form.user_msg}</p>
        </div>
      ))}
    </div>
  );
}
```

## Form Submission Example

```tsx
import { formAPI, FormFilledCreate } from './api';
import { useState } from 'react';

export function FormulairePage() {
  const [formData, setFormData] = useState<FormFilledCreate>({
    user_type: '',
    user_name: '',
    user_city: '',
    user_country: '',
    school_type: '',
    user_msg: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await formAPI.create(formData);
      setSuccess(true);
      setFormData({
        user_type: '',
        user_name: '',
        user_city: '',
        user_country: '',
        school_type: '',
        user_msg: '',
      });
      console.log('Form submitted:', response.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Form submitted successfully!</div>}

      <input
        type="text"
        name="user_name"
        placeholder="Nom"
        value={formData.user_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="user_type"
        placeholder="Type d'utilisateur"
        value={formData.user_type}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="user_city"
        placeholder="Ville"
        value={formData.user_city}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="user_country"
        placeholder="Pays"
        value={formData.user_country}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="school_type"
        placeholder="Type d'école"
        value={formData.school_type || ''}
        onChange={handleChange}
      />

      <textarea
        name="user_msg"
        placeholder="Message"
        value={formData.user_msg || ''}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
```

## Error Handling

All API errors are thrown as `APIError` objects:

```tsx
import { formAPI } from './api';

try {
  await formAPI.create(data);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // error.status: HTTP status code
    // error.detail: Error message from server
  }
}
```

## Type Definitions

All types are exported from `api.tsx`:

```tsx
import {
  FormFilledCreate,      // For creating forms
  FormFilledUpdate,      // For updating forms
  FormFilledResponse,    // For API responses
} from './api';
```

## API Base URL

To change the API URL, edit `.env`:

```env
# Development
VITE_API_URL=http://localhost:8000

# Production
VITE_API_URL=https://api.example.com
```

## Available Endpoints

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| POST | `/form/` | `formAPI.create()` | FormFilledResponse |
| GET | `/form/` | `formAPI.getAll()` | FormFilledResponse[] |
| GET | `/form/{id}` | `formAPI.getById(id)` | FormFilledResponse |
| PUT | `/form/{id}` | `formAPI.update(id, data)` | FormFilledResponse |
| DELETE | `/form/{id}` | `formAPI.delete(id)` | void |
| GET | `/health` | `systemAPI.health()` | { healthy: boolean, db: string } |
| GET | `/` | `systemAPI.status()` | { status: string } |

## Development Tips

1. **Check API Status**: Call `systemAPI.health()` to verify backend is running
2. **Async/Await**: All API calls are async, use `await` or `.then()`
3. **Error Handling**: Always wrap API calls in try/catch
4. **Loading States**: Track loading state during API calls
5. **CORS**: If you get CORS errors, ensure backend is running on `http://localhost:8000`

## Common Issues

### "CORS error"
- Ensure backend is running: `docker-compose up -d`
- Check `VITE_API_URL` in `.env`

### "Cannot find module"
- Make sure `api.tsx` exists in `src/` directory
- Check import path: `import { formAPI } from './api'`

### "Type not found"
- Import types from `api.tsx`: `import { FormFilledResponse } from './api'`

## Next Steps

The API is ready to use! Start integrating it into your components:

1. ✅ API service is configured
2. ✅ Types are defined
3. ✅ Error handling is in place
4. ✅ Ready for frontend development

Happy coding! 🚀
