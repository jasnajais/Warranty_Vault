# Warranty Vault

Track product warranties, store receipts, and never miss an expiry date again.

## Features

- Add warranties with product name, store, purchase date, and warranty period
- Upload receipt images or PDFs
- Dashboard with stats: Active, Expiring Soon, Expired
- Search and filter warranties
- Automatic expiry calculation (30-day "expiring soon" alert)

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Storage:** JSON file (no database setup required)

## Getting Started

### Prerequisites

- Node.js 18+

### Backend

```bash
cd server
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

Copy `server/.env.example` to `server/.env` and update if needed:

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

## License

MIT
