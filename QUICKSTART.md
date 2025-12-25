# Quick Start Guide

Welcome to NightChill! This guide will help you get started with the project quickly.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ and npm
- **Git** installed
- **PostgreSQL** 14+ (or Docker)
- **Redis** 6+ (or Docker)
- A code editor (VS Code recommended)
- Basic knowledge of JavaScript/TypeScript and React

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/DIRTYBOXING/nightchill.git
cd nightchill
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Mobile (if working on mobile app)
cd ../mobile
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Minimum required variables:
```bash
DATABASE_URL=postgresql://localhost:5432/nightchill
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-this
```

### 4. Set Up Database

```bash
# Using Docker (recommended for development)
docker-compose up -d db redis

# Or install PostgreSQL and Redis locally
# Then run migrations
npm run migrate
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Start mobile (optional)
cd mobile
npm run start
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Mobile:** Scan QR code with Expo Go app

## 🎨 Choose Your First Task

### For Designers
1. Review [VISION.md](./VISION.md) and [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)
2. Check out the [Figma file](https://figma.com/nightchill) (to be created)
3. Look for issues labeled `design`

### For Frontend Developers
1. Check out [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. Look for issues labeled `frontend` or `good first issue`
3. Common tasks:
   - Implement UI components
   - Add theme modes (light/dark/neon)
   - Build map interface
   - Create journey progress visualizations

### For Backend Developers
1. Review [API.md](./docs/API.md) and [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)
2. Look for issues labeled `backend` or `api`
3. Common tasks:
   - Build API endpoints
   - Implement authentication
   - Create database queries
   - Set up Redis caching

### For Mobile Developers
1. Check React Native setup in `/mobile`
2. Look for issues labeled `mobile` or `ios`/`android`
3. Common tasks:
   - Build mobile UI components
   - Implement geolocation features
   - Add QR code scanning
   - Optimize performance

### For DevOps Engineers
1. Review [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
2. Look for issues labeled `infrastructure` or `devops`
3. Common tasks:
   - Improve Docker setup
   - Set up CI/CD pipelines
   - Configure monitoring
   - Optimize deployment

## 📁 Project Structure

```
nightchill/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── tests/               # Backend tests
│   └── package.json
│
├── frontend/                # React web application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   ├── styles/          # CSS/styled components
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
│
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   └── services/
│   └── package.json
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── API.md              # API documentation
│   ├── DATABASE_SCHEMA.md  # Database schema
│   ├── DESIGN_SYSTEM.md    # Design guidelines
│   └── DEPLOYMENT.md       # Deployment guide
│
├── VISION.md               # Product vision
├── CONTRIBUTING.md         # Contribution guide
├── README.md               # Project overview
└── docker-compose.yml      # Docker setup
```

## 🔧 Common Commands

### Backend

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Run migrations
npm run migrate

# Create new migration
npm run migrate:create -- migration_name

# Build for production
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Connect to PostgreSQL
psql -U postgres -d nightchill

# Create database
createdb nightchill

# Drop database
dropdb nightchill

# Backup database
pg_dump nightchill > backup.sql

# Restore database
psql nightchill < backup.sql
```

### Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose build

# Run command in container
docker-compose exec api npm run migrate
```

## 🧪 Testing

### Run Tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Write Tests

Follow existing test patterns in `/tests` directories.

Example:
```typescript
describe('User API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'securepass123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
  });
});
```

## 🐛 Debugging

### Backend Debugging (VS Code)

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/backend/src/server.ts",
  "preLaunchTask": "tsc: build - tsconfig.json",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
}
```

### Frontend Debugging

Use React DevTools browser extension.

### API Testing

Use Postman or similar tools. Import collection from `/docs/postman_collection.json` (to be created).

## 📚 Learning Resources

### NightChill Specific
- [VISION.md](./VISION.md) - Understand the mission
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical architecture
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - Design guidelines

### General
- [Node.js Documentation](https://nodejs.org/docs)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 💬 Getting Help

- **GitHub Discussions:** Ask questions and share ideas
- **Issues:** Report bugs or request features
- **Discord:** Join our community (link to be added)
- **Email:** support@nightchill.app

## ✅ Next Steps

1. Read [VISION.md](./VISION.md) to understand the mission
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
3. Pick an issue from the [Issues page](https://github.com/DIRTYBOXING/nightchill/issues)
4. Join the conversation in [Discussions](https://github.com/DIRTYBOXING/nightchill/discussions)
5. Make your first contribution! 🎉

## 🎯 Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `documentation` - Help improve docs
- `bug` - Fix a bug
- `enhancement` - Add a new feature

## 💡 Tips

1. **Start Small:** Pick a small task for your first contribution
2. **Ask Questions:** Don't hesitate to ask for help
3. **Read the Code:** Explore the codebase to understand patterns
4. **Test Everything:** Always test your changes
5. **Document Changes:** Update docs when adding features
6. **Follow the Style:** Match existing code style
7. **Be Patient:** Code review may take a few days

## 🌟 Contributing

Your contribution, no matter how small, helps build a tool that can genuinely help people reduce anxiety and build community support.

**Remember:** The journey matters more than the destination. Take it one step at a time.

---

**Questions?** Open a discussion or reach out to the maintainers. We're here to help! 🚀
