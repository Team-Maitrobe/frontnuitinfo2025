import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

// Import correct pour le déploiement
import schoolImg from "../assets/school.jpg";
import moodleImg from "../assets/moodle.png";
import nextcloudImg from "../assets/nextcloud.png";
import libreofficeImg from "../assets/libreoffice.png";
import bbbImg from "../assets/bbb.png";

export default function PageProf() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-auto">

          {/* Bloc texte */}
          <section className="p-10 flex items-center bg-gradient-to-br from-gray-200 to-[#81C784]">
            <p className="max-w-2xl text-xl m-0">
              L'accès à la connaissance ne devrait jamais être conditionné par un abonnement.
              En adoptant les GAFAM, l'école accepte une <strong>dette technologique</strong> à long terme,
              liant l'avenir de l'éducation aux décisions d'un PDG.
            </p>
          </section>

          {/* Illustration */}
          <section className="bg-gray-200 p-0 m-0">
            <div className="w-full h-[500px] border-y-[6px] border-[#81C784] overflow-hidden">
              <img
                src={schoolImg}
                alt="illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Technologies open source */}
          <section className="p-10 bg-gray-100">
            <h2 className="text-3xl mb-6">Technologies scolaires open-source utiles</h2>

            <div className="grid grid-cols-2 gap-6">

              {/* Moodle */}
              <div className="bg-[#81C784] p-6 rounded-xl shadow text-center text-white">
                <img src={moodleImg} alt="Moodle" className="w-20 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Moodle</h3>
                <p>Une plateforme d'apprentissage en ligne complète permettant aux enseignants de créer des cours et activités.</p>
              </div>

              {/* Nextcloud */}
              <div className="bg-[#81C784] p-6 rounded-xl shadow text-center text-white">
                <img src={nextcloudImg} alt="Nextcloud" className="w-20 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Nextcloud</h3>
                <p>Stockage, partage de fichiers et collaboration sans dépendre des géants du cloud.</p>
              </div>

              {/* LibreOffice */}
              <div className="bg-[#81C784] p-6 rounded-xl shadow text-center text-white">
                <img src={libreofficeImg} alt="LibreOffice" className="w-20 mx-auto mb-3" />
                <h3 className="text-xl font-bold">LibreOffice</h3>
                <p>Une suite bureautique puissante et gratuite, alternative complète aux outils propriétaires.</p>
              </div>

              {/* BigBlueButton */}
              <div className="bg-[#81C784] p-6 rounded-xl shadow text-center text-white">
                <img src={bbbImg} alt="BigBlueButton" className="w-20 mx-auto mb-3" />
                <h3 className="text-xl font-bold">BigBlueButton</h3>
                <p>Une solution de visioconférence conçue spécialement pour l'enseignement à distance.</p>
              </div>

            </div>
          </section>

          {/* Bouton formulaire */}
          <div className="flex justify-center my-10">
            <Link
              to="/formulaire"
              className="bg-[#81C784] text-white px-10 py-5 rounded-xl text-2xl font-bold shadow-lg"
            >
              Cliquez ici si vous voulez répondre à un formulaire
            </Link>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
