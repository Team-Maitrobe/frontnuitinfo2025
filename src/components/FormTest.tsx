import { useState } from 'react';
import { useFormCreate } from '../hooks/useForm';
import type { FormFilledCreate } from '../api';

export function FormTest() {
  const [formData, setFormData] = useState<FormFilledCreate>({
    user_type: '',
    user_name: '',
    user_city: '',
    user_country: '',
    school_type: '',
    user_msg: '',
  });

  const { createForm, loading, error, success } = useFormCreate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate required fields
    if (!formData.user_type || !formData.user_name || !formData.user_city || !formData.user_country) {
      setSubmitError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createForm(formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        user_type: '',
        user_name: '',
        user_city: '',
        user_country: '',
        school_type: '',
        user_msg: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Une erreur est survenue'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Formulaire Test</h2>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✓ Formulaire envoyé avec succès!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Erreur: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type d'utilisateur */}
        <div>
          <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-1">
            Type d'utilisateur *
          </label>
          <input
            type="text"
            id="user_type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            placeholder="Ex: Élève, Professeur, Parent"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            placeholder="Votre nom complet"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Ville */}
        <div>
          <label htmlFor="user_city" className="block text-sm font-medium text-gray-700 mb-1">
            Ville *
          </label>
          <input
            type="text"
            id="user_city"
            name="user_city"
            value={formData.user_city}
            onChange={handleChange}
            placeholder="Votre ville"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Pays */}
        <div>
          <label htmlFor="user_country" className="block text-sm font-medium text-gray-700 mb-1">
            Pays *
          </label>
          <input
            type="text"
            id="user_country"
            name="user_country"
            value={formData.user_country}
            onChange={handleChange}
            placeholder="Votre pays"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Type d'école (optionnel) */}
        <div>
          <label htmlFor="school_type" className="block text-sm font-medium text-gray-700 mb-1">
            Type d'école (optionnel)
          </label>
          <input
            type="text"
            id="school_type"
            name="school_type"
            value={formData.school_type}
            onChange={handleChange}
            placeholder="Ex: Lycée, Collège, Université"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Message (optionnel) */}
        <div>
          <label htmlFor="user_msg" className="block text-sm font-medium text-gray-700 mb-1">
            Message (optionnel)
          </label>
          <textarea
            id="user_msg"
            name="user_msg"
            value={formData.user_msg}
            onChange={handleChange}
            placeholder="Votre message ici..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>

        {/* Note sur les champs obligatoires */}
        <p className="text-xs text-gray-500 text-center">
          * Champs obligatoires
        </p>
      </form>
    </div>
  );
}
