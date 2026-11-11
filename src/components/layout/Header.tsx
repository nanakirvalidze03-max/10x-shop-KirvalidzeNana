import { useCallback, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Confetti } from '../ui/Confetti';

const LINK_BASE =
  'flex min-h-11 items-center rounded-xl border-2 px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `${LINK_BASE} ${isActive ? 'border-line bg-pop text-on-pop shadow-pop' : 'border-transparent text-ink hover:border-line'}`;
const BUTTON_CLASS = `${LINK_BASE} border-transparent text-ink hover:border-line`;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Easter egg: click the logo 5 times quickly (each click within 1.5 s of the previous one)
  const [party, setParty] = useState(false);
  const logoClicks = useRef({ count: 0, last: 0 });
  const handlePartyDone = useCallback(() => setParty(false), []);

  function handleLogoClick() {
    closeMenu();
    const now = Date.now();
    const clicks = logoClicks.current;
    clicks.count = now - clicks.last > 1500 ? 1 : clicks.count + 1;
    clicks.last = now;
    if (clicks.count >= 5) {
      clicks.count = 0;
      setParty(true);
      showToast('🎉 You found the secret! Virtual high-five ✋', 'success');
    }
  }

  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout(); // the cart is NOT cleared by logout
    closeMenu();
    navigate('/');
  }

  return (
    <>
    {party && <Confetti onDone={handlePartyDone} />}
    <header className="sticky top-0 z-40 border-b-2 border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 py-2">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 font-display text-2xl font-extrabold focus-visible:outline-2 focus-visible:outline-brand">
          <span className="inline-block -rotate-3 rounded-xl border-2 border-line bg-pop px-2 py-0.5 text-on-pop shadow-pop">10X</span>
          Shop
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 border-line bg-surface text-xl shadow-pop hover:bg-pop hover:text-on-pop focus-visible:outline-2 focus-visible:outline-brand md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>

        {/* mobile: collapsed under the logo; md and up: one row */}
        <nav id="main-nav" aria-label="Main" className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-1 py-2 md:flex md:w-auto md:flex-row md:items-center md:py-0`}>
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            Catalog
          </NavLink>
          <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
            Cart 🛒
            {itemCount > 0 && (
              // key={itemCount}: React re-creates the badge on every change, so the "pop" animation replays
              <span key={itemCount} className="ml-2 animate-pop rounded-full border-2 border-line bg-hot px-2 text-xs font-extrabold text-on-pop" aria-label={`${itemCount} items in cart`}>
                {itemCount}
              </span>
            )}
          </NavLink>
          {user.isLoggedIn && (
            <NavLink to="/orders" className={linkClass} onClick={closeMenu}>
              Orders
            </NavLink>
          )}
          {user.isLoggedIn ? (
            <button type="button" onClick={handleLogout} className={BUTTON_CLASS}>
              Log out ({user.username})
            </button>
          ) : (
            <>
              <NavLink to="/signup" className={linkClass} onClick={closeMenu}>
                Sign up
              </NavLink>
              <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                Log in
              </NavLink>
            </>
          )}
          <button type="button" onClick={toggleTheme} className={BUTTON_CLASS} aria-label="Toggle dark mode">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>
      </div>
    </header>
    </>
  );
}
