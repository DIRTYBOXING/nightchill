import { Outlet, NavLink } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
  const { theme, setTheme } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--bg-tertiary)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
            NightChill
          </NavLink>

          <div className="flex items-center gap-4">
            {/* Theme Switcher */}
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  theme === 'light' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: theme === 'light' ? 'var(--bg-primary)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
                aria-label="Light mode"
              >
                ☀️
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  theme === 'dark' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--bg-primary)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
                aria-label="Dark mode"
              >
                🌙
              </button>
              <button
                onClick={() => setTheme('neon')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  theme === 'neon' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: theme === 'neon' ? 'var(--bg-primary)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
                aria-label="Neon mode"
              >
                ✨
              </button>
            </div>

            {/* Auth Links */}
            {isAuthenticated ? (
              <NavLink to="/profile" className="flex items-center gap-2">
                <span style={{ color: 'var(--text-secondary)' }}>{user?.displayName}</span>
              </NavLink>
            ) : (
              <NavLink to="/login" className="btn-primary text-sm">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: 'var(--bg-tertiary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 py-3">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-2 px-1 transition-colors ${isActive ? 'font-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : 'none',
                })}
              >
                🏠 Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `py-2 px-1 transition-colors ${isActive ? 'font-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : 'none',
                })}
              >
                📍 Map
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/journey"
                className={({ isActive }) =>
                  `py-2 px-1 transition-colors ${isActive ? 'font-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : 'none',
                })}
              >
                🛤️ Journey
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `py-2 px-1 transition-colors ${isActive ? 'font-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : 'none',
                })}
              >
                💬 Chat
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: 'var(--bg-tertiary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
          <p>NightChill — Building mental resilience through structure, support, and community</p>
          <p className="text-sm mt-2">The journey matters more than the destination.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
