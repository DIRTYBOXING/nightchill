import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
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

      // For demo purposes, create user
      const user = {
        id: Date.now().toString(),
        email,
        username,
        displayName: displayName || username,
        journeyLevel: 1,
        currentStreak: 0,
      };

      login(user, 'demo-token');
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
            Start your journey today
          </p>
        </div>

        <div className="card neon-glow">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Create Account
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

            <div className="mb-4">
              <label className="block mb-2" style={{ color: 'var(--text-primary)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="yourname"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2" style={{ color: 'var(--text-primary)' }}>
                Display Name <span style={{ color: 'var(--text-tertiary)' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
                placeholder="How should we call you?"
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
                minLength={8}
              />
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                At least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mb-4"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Creating account...' : 'Start Journey'}
            </button>
          </form>

          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          The journey matters more than the destination.
        </p>
      </div>
    </div>
  );
};

export default Register;
