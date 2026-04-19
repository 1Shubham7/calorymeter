<div align="center">
  <h1>Calorymeter</h1>

  [![GitHub last commit](https://img.shields.io/github/last-commit/1Shubham7/calorymeter)](#)
  ![GitHub language count](https://img.shields.io/github/languages/count/1Shubham7/calorymeter)
  ![GitHub top language](https://img.shields.io/github/languages/top/1Shubham7/calorymeter)
</div>

Calorymeter is a full-stack calorie tracking project built with Go, React, MongoDB, WebSockets, JWT auth, email OTP signup, and Gemini-powered AI tips.

This README now covers the main app in this repo:

- Go backend in the repo root
- React frontend in `frontend/`

For the separate food photo analyzer subproject, see [food-recorgnition/SETUP.md](./food-recorgnition/SETUP.md).

## Tech Stack

- Backend: Go, Gin
- Frontend: React, Create React App
- Database: MongoDB
- Auth: JWT + OTP signup flow
- AI tips: Gemini API
- Real-time chat: WebSockets

## Project Structure

```text
.
├── main.go              # Go backend
├── api/                 # handlers
├── routes/              # route registration
├── db/                  # MongoDB connection
├── frontend/            # React frontend
└── food-recorgnition/   # separate subproject
```

## Prerequisites

Install these before running locally:

1. Go
2. Node.js and npm
3. MongoDB

What I verified on this machine:

- `go version` -> `go1.24.2`
- `node -v` -> `v24.12.0`
- `npm -v` -> `11.6.2`

## Backend Requirements

The Go backend expects:

- MongoDB running on `mongodb://localhost:27017`
- database name `caloriesdb`
- backend port `8000` by default

The frontend is hardcoded to call:

- `http://localhost:8000`
- `ws://localhost:8000/ws`

So for local development, keep the backend on port `8000` unless you also update the frontend URLs.

## Environment Variables

Two backend-related secrets matter:

1. `PRIVATE_KEY`
2. `GEMINI_API_KEY`

Recommended local setup:

- export `PRIVATE_KEY` in your terminal before starting the Go server
- keep `GEMINI_API_KEY` in the repo-root `.env`

Example:

```bash
export PRIVATE_KEY="replace-this-with-a-long-random-secret"
```

Repo-root `.env` example:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:

- `GEMINI_API_KEY` is used by the `/tip` route.
- `PRIVATE_KEY` is used for JWT token signing.
- If you skip `GEMINI_API_KEY`, the app can still run, but the AI tip feature will fail.

## MongoDB Setup

You have two common options.

### Option 1: Local MongoDB install

Start your local MongoDB service so it listens on `localhost:27017`.

### Option 2: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

This matches the connection string currently used by [db/connection.go](./db/connection.go).

## Run The Go Backend

From the repo root:

```bash
cd /home/shubham/Code/Personal/calorymeter
export PRIVATE_KEY="replace-this-with-a-long-random-secret"
go run main.go
```

Expected backend URL:

```text
http://localhost:8000
```

Useful shortcuts already present in the Makefile:

```bash
make server
make mongo
```

Important project-specific notes:

- The backend will try to connect to MongoDB immediately on startup.
- If MongoDB is not running, the server will fail at startup.
- If port `8000` is already busy, stop the other process using it first.

## Run The React Frontend

From another terminal:

```bash
cd /home/shubham/Code/Personal/calorymeter/frontend
npm ci
npm start
```

Expected frontend URL:

```text
http://localhost:3000
```

The frontend talks directly to the Go backend on port `8000`, so the backend should already be running before you use the UI.

## Full Local Run Flow

Open terminal 1:

```bash
cd /home/shubham/Code/Personal/calorymeter
export PRIVATE_KEY="replace-this-with-a-long-random-secret"
go run main.go
```

Open terminal 2:

```bash
cd /home/shubham/Code/Personal/calorymeter/frontend
npm ci
npm start
```

Then open:

```text
http://localhost:3000
```

## Optional Verification Commands

Backend compile check:

```bash
cd /home/shubham/Code/Personal/calorymeter
go build ./...
```

Frontend production build check:

```bash
cd /home/shubham/Code/Personal/calorymeter/frontend
npm run build
```

I verified both of the above successfully in this workspace.

## Signup / OTP / AI Caveats

Some features need extra setup beyond just starting the servers.

### Signup OTP mail flow

The signup OTP handler currently uses a hardcoded Gmail sender in [api/otp.go](./api/otp.go) instead of environment variables.

That means:

- signup may work only if those credentials are still valid
- if OTP email sending fails, you will need to replace that sender with your own Gmail + App Password or refactor it to env-based config

### Gemini AI tips

The `/tip` endpoint needs `GEMINI_API_KEY`.

If you do not have one yet, create it from Google AI Studio:

- `https://aistudio.google.com/app/apikey`

Without that key:

- the rest of the app can still run
- the AI tip feature will fail

## Troubleshooting

### Backend says it cannot connect to MongoDB

Start MongoDB first, then rerun:

```bash
go run main.go
```

### Backend says port `8000` is already in use

Stop the other process using port `8000`, because the frontend is hardcoded to call that port.

### Frontend starts but API calls fail

Check that:

1. the Go backend is running
2. it is listening on `http://localhost:8000`
3. MongoDB is running

### `/tip` fails

Check that repo-root `.env` contains a valid `GEMINI_API_KEY`.

### Signup OTP email does not arrive

The mail sender config is currently embedded in code. If it stops working, update the sender configuration in [api/otp.go](./api/otp.go) and [mail/mail.go](./mail/mail.go).

## Contributing

  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/1shubham7/calorymeter)
  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/1shubham7/calorymeter)
  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr/1shubham7/calorymeter)
  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr-closed/1shubham7/calorymeter)

Contributions are welcome. Open an issue or submit a pull request with a clear description of the change.

## License

`Calorymeter` is open-source software licensed under the MIT License.
