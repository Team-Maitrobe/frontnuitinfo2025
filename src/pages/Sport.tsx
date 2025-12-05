import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function Sport() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-10 space-y-10">
          <h2 className="text-3xl font-bold mb-6">Page sport</h2>

          {/* Bloc exercice 1 */}
          <section className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Les Tractions</h3>
              <p className="mt-2">Les tractions renforcent le dos, les bras et la posture générale.</p>

              <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
                <li>Garder les épaules basses et serrées (pas levées vers les oreilles).</li>
                <li>Engager les abdos pour stabiliser le corps.</li>
                <li>Monter sans élan, en contrôlant le mouvement.</li>
                <li>Descendre lentement pour éviter toute blessure.</li>
                <li>Garder les jambes immobiles (pas de balancement).</li>
              </ul>
            </div>

            <iframe
              className="w-full h-64 rounded-xl shadow"
              src="https://www.youtube.com/embed/w3K67qBRyNc"
              title="Les Tractions"
              allowFullScreen
            ></iframe>
          </section>

          <hr className="border-t-4 border-green-500 my-10" />

          {/* Bloc exercice 2 */}
          <section className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">La Planche</h3>
              <p className="mt-2">La planche renforce le gainage et stabilise toute la chaîne musculaire.</p>

              <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
                <li>Garder le corps aligné de la tête aux talons.</li>
                <li>Ne pas creuser le bas du dos (rentrer le nombril).</li>
                <li>Contracter abdos, fessiers et jambes.</li>
                <li>Regarder légèrement vers le sol pour garder la nuque neutre.</li>
                <li>Respirer lentement sans bloquer la respiration.</li>
              </ul>
            </div>

            <iframe
              className="w-full h-64 rounded-xl shadow"
              src="https://www.youtube.com/embed/3n8ecRuE1dY"
              title="La Planche"
              allowFullScreen
            ></iframe>
          </section>

          <hr className="border-t-4 border-green-500 my-10" />

          {/* Bloc exercice 3 */}
          <section className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Les Pompes</h3>
              <p className="mt-2">Les pompes développent le buste, les bras et le gainage.</p>

              <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
                <li>Garder le corps droit du début à la fin.</li>
                <li>Placer les mains à largeur d’épaules.</li>
                <li>Descendre la poitrine jusqu’à quelques centimètres du sol.</li>
                <li>Garder les coudes à 45° du corps (pas trop écartés).</li>
                <li>Contrôler la montée sans creuser le dos.</li>
              </ul>
            </div>

            <iframe
              className="w-full h-64 rounded-xl shadow"
              src="https://www.youtube.com/embed/n8PJC6yo_1o"
              title="Les Pompes"
              allowFullScreen
            ></iframe>
          </section>

          <hr className="border-t-4 border-green-500 my-10" />

          {/* Bloc exercice 4 */}
          <section className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Les Squats</h3>
              <p className="mt-2">Les squats renforcent les jambes, les fessiers et le bas du dos.</p>

              <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
                <li>Garder les pieds à largeur d’épaules.</li>
                <li>Garder la poitrine relevée et le dos droit.</li>
                <li>Pousser les hanches vers l'arrière comme pour s’asseoir.</li>
                <li>Les genoux doivent suivre la direction des orteils.</li>
                <li>Monter en poussant dans les talons.</li>
              </ul>
            </div>

            <iframe
              className="w-full h-64 rounded-xl shadow"
              src="https://www.youtube.com/embed/eFEVKmp3M4g"
              title="Les Squats"
              allowFullScreen
            ></iframe>
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}
