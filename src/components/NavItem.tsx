// src/components/NavItem.tsx
import { Link, useLocation } from 'react-router-dom';

type NavItemProps = {
  to: string;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  const location = useLocation();

  const isActive = location.pathname === to;

  const baseClass = "hover:text-primary-red transition-colors";
  const activeClass = isActive ? "text-primary-red font-semibold" : "text-gray-700";

  return (
    <Link to={to} className={`${baseClass} ${activeClass}`}>
      {label}
    </Link>
  );
};

export default NavItem;
