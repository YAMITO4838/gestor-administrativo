import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks: { to: string; label: string; Icon: LucideIcon }[] = [
    { to: '/dashboard', label: 'Panel', Icon: LayoutDashboard },
    { to: '/projects', label: 'Proyectos', Icon: FolderKanban },
    { to: '/clients', label: 'Clientes', Icon: UsersRound },
  ];

  return (
    <nav className="premium-nav sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#b5965b]/60 bg-[#29143d] shadow-soft">
              <span className="text-sm font-extrabold text-[#d9bd78]">GA</span>
            </div>
            <span className="hidden text-lg font-extrabold tracking-tight text-ink sm:block">
              Gestor Administrativo
            </span>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label, Icon }) => {
              const active = location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                    active
                      ? 'border border-[#b5965b]/60 bg-[#f7f0df] text-[#6f5526] shadow-sm'
                      : 'text-graphite hover:bg-stone-100 hover:text-ink'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-bold text-ink">{user?.username}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-graphite">{user?.role}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b5965b]/50 bg-white shadow-sm">
              {user?.username ? (
                <span className="text-sm font-extrabold uppercase text-[#6f5526]">
                  {user.username.charAt(0)}
                </span>
              ) : (
                <UserRound size={18} className="text-[#6f5526]" aria-hidden="true" />
              )}
            </div>
            <button onClick={handleLogout} className="premium-button-secondary hidden px-3 py-2 sm:flex">
              <LogOut size={17} aria-hidden="true" />
              Salir
            </button>

            <button
              className="premium-icon-button md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="space-y-1 border-t border-stone-200 py-4 md:hidden">
            {navLinks.map(({ to, label, Icon }) => {
              const active = location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                    active
                      ? 'bg-[#f7f0df] text-[#6f5526]'
                      : 'text-graphite hover:bg-stone-100 hover:text-ink'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} aria-hidden="true" />
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
