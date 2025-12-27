import { useAuthStore } from '../store/authStore';

const Journey = () => {
  const { isAuthenticated, user } = useAuthStore();

  const levels = [
    {
      level: 1,
      name: 'Show Up',
      description: 'Take the first step',
      actions: ['Get a coffee', 'Take a walk', 'Check in on the app'],
      reward: "You started. That's everything.",
    },
    {
      level: 2,
      name: 'Routine',
      description: 'Build consistency',
      actions: ['Visit a gym', 'Chat with a mentor', 'Log 3 check-ins'],
      reward: "You're building momentum.",
    },
    {
      level: 3,
      name: 'Structure',
      description: 'Establish weekly plan',
      actions: ['Schedule weekly activities', 'Set reminders', 'Plan ahead'],
      reward: "You have a plan. That's power.",
    },
    {
      level: 4,
      name: 'Discipline',
      description: 'Maintain consistency streaks',
      actions: ['2-week streak', 'Regular mentor check-ins', 'Routine adherence'],
      reward: "You're proving it to yourself.",
    },
    {
      level: 5,
      name: 'Resilience',
      description: 'Self-led stability',
      actions: ['30-day streak', 'Autonomous routine', 'Mentor graduation'],
      reward: "You've built something lasting.",
    },
  ];

  const currentLevel = user?.journeyLevel || 1;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Your Wellness Journey
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Building resilience through structure, discipline, and consistency
        </p>
      </div>

      {/* Current Status */}
      {isAuthenticated && (
        <div className="card mb-12 text-center neon-glow">
          <span className="text-6xl block mb-4">🛡️</span>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Level {currentLevel}: {levels[currentLevel - 1].name}
          </h2>
          <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
            {levels[currentLevel - 1].description}
          </p>
          <div 
            className="w-full h-3 rounded-full mb-4"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(currentLevel / 5) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              }}
            />
          </div>
          <p className="text-sm italic" style={{ color: 'var(--accent-primary)' }}>
            "{levels[currentLevel - 1].reward}"
          </p>
        </div>
      )}

      {/* Journey Path */}
      <div className="relative">
        {levels.map((level, index) => {
          const isCompleted = currentLevel > level.level;
          const isCurrent = currentLevel === level.level;
          const isLocked = currentLevel < level.level && isAuthenticated;

          return (
            <div key={level.level} className="flex mb-8">
              {/* Level Indicator */}
              <div className="flex flex-col items-center mr-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                    isCurrent ? 'neon-glow' : ''
                  }`}
                  style={{
                    backgroundColor: isCompleted
                      ? 'var(--accent-primary)'
                      : isCurrent
                      ? 'var(--accent-secondary)'
                      : 'var(--bg-tertiary)',
                    color: isCompleted || isCurrent ? 'white' : 'var(--text-tertiary)',
                  }}
                >
                  {isCompleted ? '✓' : level.level}
                </div>
                {index < levels.length - 1 && (
                  <div
                    className="w-1 flex-1 mt-2"
                    style={{
                      backgroundColor: isCompleted ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      minHeight: '60px',
                    }}
                  />
                )}
              </div>

              {/* Level Content */}
              <div
                className={`card flex-1 ${isCurrent ? 'neon-glow' : ''} ${
                  isLocked && !isAuthenticated ? '' : ''
                }`}
                style={{
                  opacity: isLocked && !isAuthenticated ? 0.6 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      Level {level.level}: {level.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{level.description}</p>
                  </div>
                  {isCompleted && (
                    <span className="text-2xl">✅</span>
                  )}
                  {isCurrent && (
                    <span className="text-2xl">🔥</span>
                  )}
                  {isLocked && (
                    <span className="text-2xl">🔒</span>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Actions:
                  </h4>
                  <ul className="space-y-1">
                    {level.actions.map((action, i) => (
                      <li key={i} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span>•</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm italic" style={{ color: 'var(--accent-primary)' }}>
                  "{level.reward}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation */}
      <div className="text-center mt-12 py-8">
        <p className="text-xl italic" style={{ color: 'var(--text-secondary)' }}>
          "The journey matters more than the destination."
        </p>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          No pressure. No rush. Just one step at a time.
        </p>
      </div>
    </div>
  );
};

export default Journey;
