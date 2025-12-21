# EnTrini

A modern gym management application built with React and Django.

## Development

### Prerequisites
- Node.js
- Python 3.8+
- Docker (optional)

### Installation

1. Clone the repository
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `pip install -r backend/requirements.txt`

### Running the Application

#### Frontend Scripts
- `npm run dev` - Start development server with production backend
- `npm run dev:local` - Start development server with local backend (requires local Django server)
- `npm run build` - Build for production

#### Backend
- Local: `cd backend && python manage.py runserver 8001`
- Docker: `docker-compose up --build`

### Environment Variables

For local development with local backend, use:
```bash
npm run dev:local
```

This sets `REACT_APP_USE_LOCAL_BACKEND=true` and connects to `http://localhost:8001/api`.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment options.