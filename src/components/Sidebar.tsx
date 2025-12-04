import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="w-[200px] bg-[#2E7D32] p-5 text-black flex flex-col gap-5 text-lg"
    >
      <Link to="/" className="no-underline text-black">OpenSchool</Link>
      <Link to="/Parent" className="no-underline text-black">Parents</Link>
      <Link to="/Prof" className="no-underline text-black">Professeurs</Link>
      <Link to="/Eleve" className="no-underline text-black">Élèves</Link>
    </aside>
  );
}
