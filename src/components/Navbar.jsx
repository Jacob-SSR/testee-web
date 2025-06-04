import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-gray-100 shadow p-4 flex space-x-4">
      <Link to="/" className={linkClass("/")}>
        รายชื่อผู้ทดสอบ
      </Link>
      <Link to="/add" className={linkClass("/add")}>
        เพิ่มผู้ทดสอบ
      </Link>
      <Link to="/theory" className={linkClass("/theory")}>
        ทดสอบทฤษฎี
      </Link>
      <Link to="/practical" className={linkClass("/practical")}>
        ทดสอบปฏิบัติ
      </Link>
    </nav>
  );
};

export default Navbar;
