import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any login
      const user = {
        id: '1',
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
        journeyLevel: 1,
        currentStreak: 0,
      };

      login(user, 'demo-token');
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
            NightChill
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back. One step at a time.
          </p>
        </div>

        <div className="card neon-glow">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Sign In
          </h2>

          {error && (
            <div 
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mb-4"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)' }}>
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          No pressure. No rush. Your pace is perfect.
        </p>
      </div>
    </div>
  );
};

export default Login;
