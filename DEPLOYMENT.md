# Deployment Guide

This guide provides easy deployment options for the EnTrini app.

## Local Development with Docker

1. Install Docker and Docker Compose
2. Run `docker-compose up --build`
3. Access frontend at http://localhost:3000, backend at http://localhost:8000

## Production Deployment

### Option 1: Railway (Backend) + Vercel (Frontend) - Recommended

#### Backend (Railway)
1. Create account at https://railway.app
2. Connect GitHub repo
3. Set environment variables:
   - `SECRET_KEY`: Generate a secure key
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: yourdomain.com
   - `CORS_ALLOWED_ORIGINS`: https://yourfrontend.vercel.app
4. Railway auto-deploys with Docker

#### Frontend (Vercel)
1. Create account at https://vercel.com
2. Connect GitHub repo
3. Set build command: `npm run build`
4. Set API_BASE_URL environment variable to Railway backend URL
5. Deploy

### Option 2: Docker Compose on VPS

1. Get a VPS (DigitalOcean, Linode, etc.)
2. Install Docker
3. Clone repo
4. Set environment variables in .env file
5. Run `docker-compose -f docker-compose.prod.yml up -d`

### Environment Variables

Create a `.env` file in backend directory:

```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourfrontend.com
```

## Database

For production, consider PostgreSQL instead of SQLite:
- Update DATABASES in settings.py
- Add psycopg2 to requirements.txt