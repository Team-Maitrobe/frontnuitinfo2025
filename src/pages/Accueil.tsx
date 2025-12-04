import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; // ✅ type-only import
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Accueil() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Variantes pour animation avec custom
  const squareVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: custom,
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-1 justify-center items-center p-8">
        {!expanded ? (
          // Bulle centrale pulsante
          <motion.div
            onClick={() => setExpanded(true)}
            className="bg-[#2E7D32] text-white flex justify-center items-center text-2xl font-bold w-64 h-64 rounded-full shadow-lg cursor-pointer text-center p-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            whileHover={{ scale: 1.1 }}
          >
            Choisissez votre profil
          </motion.div>
        ) : (
          // Grille 3 carrés centrés
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <motion.div
              onClick={() => navigate("/eleve")}
              className="bg-[#81C784] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-[#388E3C]"
              custom={0}
              variants={squareVariants}
              initial="hidden"
              animate="visible"
            >
              Élève
            </motion.div>

            <motion.div
              onClick={() => navigate("/prof")}
              className="bg-[#81C784] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-[#388E3C]"
              custom={0.2}
              variants={squareVariants}
              initial="hidden"
              animate="visible"
            >
              Prof
            </motion.div>

            <motion.div
              onClick={() => navigate("/parent")}
              className="bg-[#81C784] text-white flex justify-center items-center text-2xl font-bold h-64 rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-[#388E3C]"
              custom={0.4}
              variants={squareVariants}
              initial="hidden"
              animate="visible"
            >
              Parent
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
