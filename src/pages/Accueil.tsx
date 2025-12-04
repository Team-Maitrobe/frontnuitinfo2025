import Header from "../components/Header";
import Footer from "../components/Footer";
import Liste from "../components/Liste";

export default function Accueil() {
  return (
    <div>
      <Header />
      <h2>Page d'accueil</h2>
      <Liste />
      <Footer />
    </div>
  );
}
