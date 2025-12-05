import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Eleve from "./pages/Eleve";
import Prof from "./pages/Prof";
import Parent from "./pages/Parent";
import Sport from "./pages/Sport";
import Formulaire from "./pages/Formulaire";
import { SnakePage } from "./pages/SnakePage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/eleve" element={<Eleve />} />
      <Route path="/prof" element={<Prof />} />
      <Route path="/parent" element={<Parent />} />
      <Route path="/sport" element={<Sport />} />
      <Route path="/formulaire" element={<Formulaire />} />
      <Route path="/snake" element={<SnakePage />} />
    </Routes>
  );
}

export default App;
