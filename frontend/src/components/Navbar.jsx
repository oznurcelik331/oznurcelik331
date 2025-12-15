import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  if (isDashboard) return null;

  const navLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/hakkimizda', label: 'Hakkımızda' },
    { path: '/projeler', label: 'Projeler' },
    { path: '/iletisim', label: 'İletişim' },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50" data-testid="main-navbar">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Logo className="transition-all duration-300" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-primary block leading-tight">Kozsağ Group</span>
              <span className="font-sans text-xs text-accent uppercase tracking-widest">İnşaat</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`font-sans text-sm font-medium tracking-wide uppercase transition-hover ${
                  location.pathname === link.path ? 'text-accent' : 'text-primary hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                className={`block py-3 font-sans text-sm font-medium tracking-wide uppercase ${
                  location.pathname === link.path ? 'text-accent' : 'text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;