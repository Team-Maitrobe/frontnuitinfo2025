import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Accueil() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Contenu central */}
      <main className="flex flex-1 justify-center items-center p-8">
        {!expanded ? (
          // Bulle centrale initiale
          <div
          onClick={() => setExpanded(true)}
          className="bg-[#EF5B5B] text-white flex justify-center items-center text-2xl font-bold w-64 h-64 rounded-full shadow-lg cursor-pointer animate-pulse hover:scale-105 transition-transform duration-500 text-center p-4"
        >
          Choisissez votre profil
        </div>

        ) : (
          // Les 3 carrés apparaissent
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <div
              onClick={() => navigate("/eleve")}
              className="bg-[#EF5B5B] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition-transform duration-500 hover:scale-105"
            >
              Élève
            </div>
            <div
              onClick={() => navigate("/prof")}
              className="bg-[#EF5B5B] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition-transform duration-500 hover:scale-105"
            >
              Prof
            </div>
            <div
              onClick={() => navigate("/parent")}
              className="bg-[#EF5B5B] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition-transform duration-500 hover:scale-105"
            >
              Parent
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
