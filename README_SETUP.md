# 🐔 Poultry Farm Management Application

A comprehensive web-based application designed to help poultry farmers (specifically laying chicken farms) manage and track all aspects of their farm operations.

## Features

### Core Features
- **User Authentication**: Secure login and registration system
- **Farm Management**: Create and manage your farm profile with location details
- **Coop Management**: Track multiple coops/houses with capacity information
- **Egg Production Tracking**: Daily egg production records by coop and grade
- **Health Monitoring**: Track bird health, mortality, illnesses, and treatments
- **Feed Inventory Management**: Monitor feed usage, types, and costs
- **Medication & Vaccination Records**: Keep detailed records of all medicines and vaccinations
- **Financial Tracking**: Record all income (egg sales) and expenses
- **Dashboard Analytics**: Visual overview of farm statistics and activities

## Tech Stack

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS
- **Security**: Password hashing with bcryptjs

## Project Structure

```
poultry-farm-app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   └── auth/         # Authentication endpoints
│   │   │   └── farm/         # Farm management endpoints
│   │   ├── dashboard/        # Dashboard page
│   │   └── page.tsx          # Login/Register page
│   ├── lib/
│   │   ├── auth.ts           # Authentication utilities
│   │   └── prisma.ts         # Prisma client
│   └── app/globals.css       # Global styles
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Database Schema

### User
- id, email, password, name, timestamps

### Farm
- id, name, location, userId (FK), timestamps

### Coop
- id, name, capacity, farmId (FK), timestamps

### EggProduction
- id, farmId (FK), coopId (FK), date, quantity, grade, notes, timestamps

### HealthRecord
- id, farmId (FK), coopId (FK), date, type, description, quantity, timestamps

### FeedRecord
- id, farmId (FK), coopId (FK), date, feedType, quantity, cost, supplier, timestamps

### Medication
- id, farmId (FK), date, name, type, dosage, coopsAffected, notes, cost, timestamps

### FinancialRecord
- id, farmId (FK), date, type, category, amount, description, timestamps

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- SQLite (included with better-sqlite3)

### Installation

1. Clone the repository:
```bash
cd poultry-farm-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev --name init
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Farm Management
- `GET /api/farm` - Get farm details
- `POST /api/farm` - Create a new farm
- `PUT /api/farm` - Update farm details
- `GET /api/farm/coops` - Get all coops
- `POST /api/farm/coops` - Create a new coop

### Farm Records
- `POST /api/farm/egg-production` - Add egg production record
- `GET /api/farm/egg-production` - Get egg production records
- `POST /api/farm/health-records` - Add health record
- `GET /api/farm/health-records` - Get health records
- `POST /api/farm/feed-records` - Add feed record
- `GET /api/farm/feed-records` - Get feed records
- `POST /api/farm/medications` - Add medication record
- `GET /api/farm/medications` - Get medication records
- `POST /api/farm/financial-records` - Add financial record
- `GET /api/farm/financial-records` - Get financial records

All API endpoints (except `/api/auth/*`) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User registers with email, password, and name
2. User logs in with email and password
3. JWT token is returned and stored in localStorage
4. Token is included in Authorization header for all subsequent requests
5. Token expires after 7 days

## Future Enhancements

- [ ] Email notifications for health alerts
- [ ] Automated backup system
- [ ] Mobile app version
- [ ] Advanced analytics and reporting
- [ ] Inventory alerts
- [ ] Weather integration
- [ ] Employee management
- [ ] Multi-farm support for one user
- [ ] Export reports to PDF/Excel
- [ ] Real-time data synchronization

## Security Notes

- Passwords are hashed using bcryptjs with salt rounds of 10
- JWT tokens expire after 7 days
- Environment variables should be configured securely
- HTTPS should be used in production
- DATABASE_URL should not be committed to version control

## Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

## Support

For issues, questions, or suggestions, please contact the development team.

## License

This project is proprietary and confidential.
