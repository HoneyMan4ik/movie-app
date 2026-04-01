Favorite movie list app

## Technologijos:

React, TypeScript, Redux Toolkit, CSS Modules, NestJS, Prisma, PostgreSQL (Neon)

## Test prisijungimas

```
Email: testuser@gmail.com
Slaptažodis: test123
```

## Kaip paleisti

### Backend .env.example to .env

## arba tiesiog pervardink į .env

```bash
cp .env.example .env
npm install
npm run start:dev
```

Serveris: `http://localhost:3000`
Swagger: `http://localhost:3000/api/docs`

### Frontend

```bash
cd movie-app-frontend
npm install
npm run dev
```

Frontas: `http://localhost:5173`

## Features

- Registracija / prisijungimas (JWT access + refresh tokens)
- Filmų CRUD
- Paieška pagal pavadinimą
- Rūšiavimas pagal pavadinimą, metus, reitingą, žanrą
- Pagination
- Validacijos (frontend + backend)
- Auth guards
- Rate limiting (100 req/min)
- Swagger API dokumentacija
- 404 puslapis
- Responsive dizainas
