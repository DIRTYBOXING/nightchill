# Deployment Guide

## Overview

This guide covers deploying NightChill to production environments. The app can be deployed to various cloud platforms including AWS, Google Cloud Platform, or containerized environments.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Docker (optional but recommended)
- Cloud provider account (AWS, GCP, etc.)
- Domain name configured with SSL

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Application
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.nightchill.app

# Database
DATABASE_URL=postgresql://user:password@host:5432/nightchill
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://host:6379
REDIS_PASSWORD=your-redis-password

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Maps
MAPBOX_ACCESS_TOKEN=your-mapbox-token
# OR
GOOGLE_MAPS_API_KEY=your-google-maps-key

# File Storage
AWS_S3_BUCKET=nightchill-assets
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@nightchill.app

# Chat AI
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key

# Security
CORS_ORIGIN=https://nightchill.app,https://www.nightchill.app
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# QR Code
QR_CODE_SECRET=your-qr-signing-secret
```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nightchill
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=nightchill
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Build and Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## AWS Deployment

### Architecture

```
┌─────────────────────────────────────────────────┐
│                 CloudFront (CDN)                │
│           (Static Assets + API Gateway)         │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────┐
│   S3 Bucket   │   │  API Gateway │
│ (Static Web)  │   │   (REST API) │
└───────────────┘   └──────┬───────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
            ┌──────────┐   ┌─────────────┐
            │   ECS    │   │   Lambda    │
            │ (API)    │   │ (Functions) │
            └────┬─────┘   └─────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐   ┌─────────────┐
│     RDS      │   │  ElastiCache│
│ (PostgreSQL) │   │   (Redis)   │
└──────────────┘   └─────────────┘
```

### Setup Steps

#### 1. Database Setup (RDS)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier nightchill-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.7 \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name nightchill-subnet

# Run migrations
npm run migrate
```

#### 2. ElastiCache (Redis)

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id nightchill-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### 3. ECS (API Service)

Create task definition:

```json
{
  "family": "nightchill-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "your-ecr-repo/nightchill-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nightchill-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Deploy:

```bash
# Build and push Docker image
docker build -t nightchill-api .
docker tag nightchill-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/nightchill-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/nightchill-api:latest

# Update ECS service
aws ecs update-service \
  --cluster nightchill-cluster \
  --service nightchill-api \
  --force-new-deployment
```

#### 4. CloudFront + S3 (Frontend)

```bash
# Create S3 bucket
aws s3 mb s3://nightchill-web

# Build frontend
npm run build

# Deploy to S3
aws s3 sync ./dist s3://nightchill-web --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id EXXXXXXXXXXXXX \
  --paths "/*"
```

---

## Google Cloud Platform Deployment

### Architecture

- **Cloud Run:** API containers
- **Cloud SQL:** PostgreSQL database
- **Cloud Memorystore:** Redis cache
- **Cloud Storage:** Static assets
- **Cloud CDN:** Content delivery

### Deploy to Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/nightchill/api

# Deploy
gcloud run deploy nightchill-api \
  --image gcr.io/nightchill/api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production,DATABASE_URL=...
```

---

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nightchill-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nightchill-api
  template:
    metadata:
      labels:
        app: nightchill-api
    spec:
      containers:
      - name: api
        image: nightchill/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: nightchill-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: nightchill-api
spec:
  selector:
    app: nightchill-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

## Database Migrations

### Run Migrations

```bash
# Development
npm run migrate

# Production
NODE_ENV=production npm run migrate
```

### Create New Migration

```bash
npm run migrate:create -- add_new_feature
```

### Rollback Migration

```bash
npm run migrate:rollback
```

---

## Monitoring & Logging

### Health Checks

Implement health check endpoints:

```typescript
// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /ready
app.get('/ready', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    await redis.ping();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});
```

### Logging

Use structured logging:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## SSL/TLS Configuration

### Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d api.nightchill.app

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.nightchill.app;

    ssl_certificate /etc/letsencrypt/live/api.nightchill.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nightchill.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/nightchill_$DATE.sql"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE.gz s3://nightchill-backups/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Automated Backups (AWS RDS)

```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier nightchill-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00"
```

---

## Scaling

### Horizontal Scaling

- **API:** Add more ECS tasks or Cloud Run instances
- **Database:** Use read replicas for read-heavy queries
- **Redis:** Use Redis cluster mode

### Vertical Scaling

- Increase container CPU/memory
- Upgrade database instance type
- Optimize queries and add indexes

### Auto-Scaling (ECS)

```json
{
  "ServiceName": "nightchill-api",
  "ScalableTargetAction": {
    "MinCapacity": 2,
    "MaxCapacity": 10
  },
  "TargetTrackingScalingPolicyConfiguration": {
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    }
  }
}
```

---

## Security Checklist

- [ ] All environment variables secured
- [ ] Database credentials rotated regularly
- [ ] SSL/TLS certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection headers
- [ ] CSRF tokens for state-changing operations
- [ ] Regular security updates
- [ ] Secrets stored in secure vault (AWS Secrets Manager, etc.)

---

## Performance Optimization

### Caching Strategy

```typescript
// Cache location data
const getLocation = async (id: string) => {
  const cacheKey = `location:${id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const location = await db.locations.findOne(id);
  await redis.setex(cacheKey, 3600, JSON.stringify(location));
  
  return location;
};
```

### Database Optimization

- Add indexes on frequently queried fields
- Use connection pooling
- Implement query caching
- Optimize N+1 queries

### CDN Configuration

- Cache static assets for 1 year
- Cache API responses where appropriate
- Use compression (gzip/brotli)

---

## Rollback Procedure

If deployment fails:

1. **Immediate:** Revert to previous ECS task definition
   ```bash
   aws ecs update-service \
     --cluster nightchill-cluster \
     --service nightchill-api \
     --task-definition nightchill-api:previous
   ```

2. **Database:** Rollback migrations if needed
   ```bash
   npm run migrate:rollback
   ```

3. **Frontend:** Revert S3 deployment
   ```bash
   aws s3 sync ./previous-build s3://nightchill-web --delete
   ```

---

## Post-Deployment Checklist

- [ ] Health checks passing
- [ ] Database migrations completed
- [ ] All services running
- [ ] SSL certificates valid
- [ ] DNS records updated
- [ ] Monitoring alerts configured
- [ ] Error tracking working
- [ ] Backup system verified
- [ ] Load testing completed
- [ ] Documentation updated

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Or ECS logs
aws logs tail /ecs/nightchill-api --follow
```

### Database Connection Issues

```bash
# Test connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check security groups/firewall rules
```

### High Memory Usage

```bash
# Check memory usage
docker stats

# Restart service
docker-compose restart api
```

---

## Support

For deployment issues:
- Documentation: https://docs.nightchill.app/deployment
- Support: devops@nightchill.app
- Status Page: https://status.nightchill.app
