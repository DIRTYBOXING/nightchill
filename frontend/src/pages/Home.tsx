import { useAuthStore } from '../store/authStore';

const Home = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          {isAuthenticated ? `${getGreeting()}, ${user?.displayName}` : 'Welcome to NightChill'}
        </h1>
        <p className="text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
          Building mental resilience through structure, support, and community.
        </p>
        <p className="text-lg italic" style={{ color: 'var(--accent-primary)' }}>
          One step at a time. Your pace is perfect.
        </p>
      </section>

      {/* Quick Actions */}
      {isAuthenticated ? (
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">🔥</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Current Streak
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              {user?.currentStreak || 0} days
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              You're building momentum!
            </p>
          </div>

          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">🛡️</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Journey Level
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              Level {user?.journeyLevel || 1}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {user?.journeyLevel === 1 && 'Show Up'}
              {user?.journeyLevel === 2 && 'Routine'}
              {user?.journeyLevel === 3 && 'Structure'}
              {user?.journeyLevel === 4 && 'Discipline'}
              {user?.journeyLevel === 5 && 'Resilience'}
            </p>
          </div>

          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">☕</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Coffee Support
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Find a calm space
            </p>
            <button className="btn-primary mt-4 text-sm">Find Nearby</button>
          </div>

          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">✅</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Daily Check-In
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              You showed up today
            </p>
            <button className="btn-secondary mt-4 text-sm">Check In</button>
          </div>
        </section>
      ) : (
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">☕</span>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Coffee Support
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Free coffee at partner locations. No questions asked, just support.
            </p>
          </div>

          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">🏋️</span>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Anxiety-Friendly Gyms
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Beginner-safe, no intimidation. Staff trained to support first-timers.
            </p>
          </div>

          <div className="card text-center neon-glow">
            <span className="text-4xl mb-4 block">🧠</span>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Mentors & Role Models
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Connect with people who understand the journey.
            </p>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="card mb-12 neon-glow">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
          Our Philosophy
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <span className="text-3xl mb-3 block">🌱</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Reduce Fear of Starting
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Remove barriers and intimidation
            </p>
          </div>
          <div className="text-center">
            <span className="text-3xl mb-3 block">📐</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Replace Chaos with Structure
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Clear paths and guidance
            </p>
          </div>
          <div className="text-center">
            <span className="text-3xl mb-3 block">🚀</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Small Actions, Big Momentum
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Progress over perfection
            </p>
          </div>
          <div className="text-center">
            <span className="text-3xl mb-3 block">💪</span>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Build Mental Resilience
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Through routine, support, consistency
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Start Your Journey
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            No pressure. No rush. Just one step at a time.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/register" className="btn-primary">
              Get Started
            </a>
            <a href="/map" className="btn-secondary">
              Explore Map
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
