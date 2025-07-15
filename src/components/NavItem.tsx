import { Link, useLocation } from "react-router-dom";

export type NavItemProps = {
  to: string;
  label: string;
  onClick?: () => void;
  darkMode?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, label, onClick, darkMode = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClass = "flex justify-center items-center w-full px-4 py-2 text-center rounded-md transition-colors duration-200";
  const activeClass = isActive
    ? darkMode
      ? "text-primary-red font-semibold bg-gray-700/50"
      : "text-primary-red font-semibold bg-gray-100"
    : darkMode
      ? "text-gray-300 hover:bg-gray-700/30"
      : "text-gray-700 hover:bg-gray-100";

  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`${baseClass} ${activeClass}`}
    >
      {label}
    </Link>
  );
};

export default NavItem;