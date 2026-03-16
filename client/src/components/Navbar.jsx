import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">
          Interview Prep
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            Hi, {user?.name?.split(" ")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-500 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
