import { Link, useLocation } from "react-router-dom";

export type NavItemProps = {
  to: string;
  label: string;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClass =
    "flex justify-center items-center w-full px-4 py-2 text-center rounded-md transition-colors duration-200";
  const activeClass = isActive
    ? "text-primary-red font-semibold bg-white/40"
    : "text-gray-800 hover:bg-white/30";

  return (
    <Link to={to} onClick={onClick} className={`${baseClass} ${activeClass}`}>
      {label}
    </Link>
  );
};

export default NavItem;
