# MediChive Backend API

## Description

MediChive is a comprehensive healthcare management system built with NestJS framework. This backend API provides services for managing medical institutions, lab reports, doctors, patients, and healthcare workflows.

## Features

- **User Management**: Authentication and authorization for different user roles
- **Lab Management**: Lab profile management and report handling
- **Doctor Management**: Doctor profiles and availability management
- **Institute Management**: Healthcare institution administration
- **Complaint System**: Patient feedback and complaint management
- **Appointment System**: Medical appointment scheduling
- **File Upload**: Secure file handling for medical reports

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system
- **Validation**: Class-validator and class-transformer

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

```bash
# Install dependencies
$ npm install

# Setup environment variables
$ cp .env.example .env
# Edit .env file with your database credentials

# Generate Prisma client
$ npm run prisma:generate

# Run database migrations
$ npx prisma migrate dev

# Seed database (optional)
$ npm run prisma:seed
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/medichive"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Debug mode
$ npm run start:debug
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access:

- API endpoints at `http://localhost:3000`
- Prisma Studio (database GUI) at `http://localhost:5555` using `npm run prisma:studio`

## Database Management

```bash
# View database in browser
$ npm run prisma:studio

# Reset database
$ npx prisma migrate reset

# Deploy migrations to production
$ npx prisma migrate deploy
```

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── appointment/         # Appointment management
├── auth/               # Authentication & authorization
├── complaint/          # Complaint system
├── diagnosis/          # Medical diagnosis
├── doctor/            # Doctor management
├── institute/         # Institution management
├── lab/               # Laboratory management
├── patient/           # Patient management
├── user/              # User management
└── prisma/            # Database service
```

## License

This project is [MIT licensed](LICENSE).
