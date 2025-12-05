import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Formulaire() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [sexePos, setSexePos] = useState({ x: 0, y: 0 });
  const [description, setDescription] = useState(""); // pour le textarea
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (!containerRef.current || !selectRef.current) return;

    const container = containerRef.current;
    const select = selectRef.current;

    const maxX = container.offsetWidth - select.offsetWidth;
    const maxY = container.offsetHeight - select.offsetHeight;

    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    setSexePos({ x, y });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Si le mot "snake" est présent dans le textarea, redirection
    if (description.toLowerCase().includes("snake")) {
      navigate("/snake");
      return;
    }

    // Ici tu peux gérer le submit normalement
    alert("Formulaire envoyé !");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" ref={containerRef}>
      <Header />

      <main className="flex-1 p-8 max-w-4xl mx-auto relative">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-6 text-center">
          Formulaire NIRD
        </h2>

        <form className="space-y-8 relative" onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Nom complet *</label>
            <input
              type="text"
              className="border-2 border-[#81C784] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              placeholder="Entrez votre nom complet complet complet…"
            />
          </div>

          {/* Sexe qui fuit */}
          <div className="flex flex-col relative h-32">
            <label className="mb-2 font-semibold">Sexe *</label>
            <select
              ref={selectRef}
              className="border-2 border-[#81C784] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-transform duration-200 absolute"
              style={{
                transform: `translate(${sexePos.x}px, ${sexePos.y}px)`,
              }}
              onMouseEnter={handleMouseEnter}
            >
              <option value="">Sélectionnez votre sexe</option>
              <option>Homme</option>
              <option>Femme</option>
              <option>Autre</option>
              <option>Je préfère ne pas répondre</option>
              <option>Je suis un alien</option>
              <option>Préférer pas dire mais en secret</option>
            </select>
            <small className="text-gray-500 mt-1">
              Bonne chance pour cliquer dessus… 😅
            </small>
          </div>

          {/* Âge */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Âge *</label>
            <input
              type="range"
              min="0"
              max="120"
              className="w-32 h-1 accent-[#2E7D32] mb-2"
            />
            <small className="text-gray-500">
              Faites glisser le curseur très précisément…
            </small>
          </div>

          {/* Préférences alimentaires */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Préférences alimentaires *</label>
            <select className="border-2 border-[#81C784] p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]">
              <option>Végétarien</option>
              <option>Vegan</option>
              <option>Omnivore</option>
              <option>Sans gluten</option>
            </select>
            <select className="border-2 border-[#81C784] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32]">
              <option>Choisissez un sous-type</option>
              <option>Bio uniquement</option>
              <option>Locavore</option>
              <option>Pas de viande le lundi</option>
              <option>Je mange que du vert</option>
            </select>
          </div>

          {/* Langues parlées */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Langues parlées *</label>
            <div className="border-2 border-[#81C784] h-24 overflow-y-scroll p-2 rounded">
              <label><input type="checkbox" /> Français</label><br/>
              <label><input type="checkbox" /> Anglais</label><br/>
              <label><input type="checkbox" /> Espagnol</label><br/>
              <label><input type="checkbox" /> Italien</label><br/>
              <label><input type="checkbox" /> Klingon</label><br/>
              <label><input type="checkbox" /> Dothraki</label><br/>
              <label><input type="checkbox" /> Elvish</label><br/>
              <label><input type="checkbox" /> Lapinou</label><br/>
              <label><input type="checkbox" /> Autre</label>
            </div>
          </div>

          {/* Description longue */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Parlez-nous de vous *</label>
            <textarea
              className="border-2 border-[#81C784] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              rows={10}
              placeholder="Écrivez beaucoup, sinon vous ne pourrez pas passer à l’étape suivante…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="bg-[#2E7D32] text-white px-6 py-3 rounded shadow hover:bg-[#1B5E20] transition-colors"
          >
            Envoyer
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
