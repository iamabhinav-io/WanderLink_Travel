import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Home,
  Utensils,
  Award,
  Users,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Building,
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wanderlink_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem('wanderlink_user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wanderlink_user');
    localStorage.removeItem('wanderlink_token');
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const baseNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/accommodation', label: 'Accommodations', icon: Building },
    { to: '/food', label: 'Food Experiences', icon: Utensils },
    { to: '/local-guides', label: 'Local Guides', icon: Award },
    { to: '/groups', label: 'Travel Groups', icon: Users },
  ];

  const loggedInLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/create-trip', label: 'Create Trip', icon: PlusCircle },
  ];

  const currentNavLinks = user ? [...baseNavLinks, ...loggedInLinks] : baseNavLinks;

  const getLinkClasses = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-emerald-900 text-white'
        : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/70'
    }`;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 block leading-tight">
                Wander<span className="text-amber-600">Link</span>
              </span>
              <span className="text-[10px] text-stone-600 font-medium tracking-tight block -mt-0.5">
                Every Journey Starts With a Connection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={getLinkClasses}>
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* User Status / Action Pill */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
                  title="View Dashboard"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="max-w-[110px] truncate">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-900 text-white'
                        : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                    }`
                  }
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {user && (
            <div className="flex items-center justify-between p-3 mb-2 bg-emerald-50 rounded-xl border border-emerald-200/60">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-800" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">{user.name}</span>
                  <span className="text-[10px] text-emerald-700 block">{user.role || 'Traveler'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {currentNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-emerald-900 text-white'
                      : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {!user && (
            <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-emerald-50"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
