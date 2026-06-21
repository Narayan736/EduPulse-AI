# EduPulse AI

AI-powered educational engagement tracking platform.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API
- **Auth:** JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gemini API key

### Server Setup

```bash
cd server
npm install
# Configure .env with your MongoDB URI, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```

### Client Setup

```bash
cd client
npm install
npm run dev
```

## Modules

| Module               | Description                                    |
|----------------------|------------------------------------------------|
| Authentication       | JWT-based register/login with role support     |
| Attendance           | Student self-mark + instructor bulk-mark       |
| Stand-ups            | Daily yesterday/today/blockers submissions     |
| Demos                | Project submissions with review workflow       |
| AI Insights          | Gemini-powered engagement analysis & risk flags|
| Analytics            | Charts and dashboards for instructors          |
