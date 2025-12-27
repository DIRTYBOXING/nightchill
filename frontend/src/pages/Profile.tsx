import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Navigate, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Your Profile
      </h1>

      {/* Profile Card */}
      <div className="card mb-8 neon-glow">
        <div className="flex items-center gap-6 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            {user?.displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user?.displayName}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>@{user?.username}</p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              {user?.currentStreak || 0}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Day Streak
            </p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              Level {user?.journeyLevel || 1}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Journey
            </p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              0
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Check-ins
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card mb-8 neon-glow">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h3>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
            Theme Mode
          </label>
          <div className="flex gap-3">
            {(['light', 'dark', 'neon'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                  theme === t ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: theme === t ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: theme === t ? 'white' : 'var(--text-secondary)',
                }}
              >
                {t === 'light' && '☀️ Light'}
                {t === 'dark' && '🌙 Dark'}
                {t === 'neon' && '✨ Neon'}
              </button>
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {theme === 'light' && 'Clean, calm, professional'}
            {theme === 'dark' && 'Low anxiety, night-friendly'}
            {theme === 'neon' && 'Motivational, modern, uplifting energy'}
          </p>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Gentle reminders, never pushy
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div 
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Share Progress
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Optional, no pressure
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div 
                className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="btn-secondary"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
