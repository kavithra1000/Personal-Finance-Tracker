# 💰 Personal Finance & Budget Tracking Application

> Developed by **Monal Kavithra Wickramasinghe**
> Information Technology Undergraduate, SLIIT

---

## 📌 Overview

A full-stack web application designed to help users manage their personal finances. It provides features for tracking income, expenses, budgets, and financial insights through a structured dashboard. The project demonstrates scalable system design, clean UI components, efficient backend services, and organized data management.

---

## 🛠️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | React / TailwindCSS / Zustand           |
| Backend        | Node.js with Express                    |
| Database       | MongoDB                                 |
| Authentication | JWT, bcrypt                             |

---

## 📂 Project Structure

```
personal-finance-app/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/                  # Static files: images, icons, fonts
│       │
│       ├── components/              # Reusable UI components
│       │   ├── budgets/             # Budget cards, progress bars, limit forms
│       │   ├── categories/          # Category badges, icons, selectors
│       │   ├── dashboard/           # Summary cards, charts, widgets
│       │   └── transaction/         # Transaction list, form, filters
│       │
│       ├── lib/                     # Utility libraries and API clients
│       │
│       ├── pages/                   # Next.js pages / route-level components
│       │
│       └── store/                   # Global state management (Redux / Zustand)
│
├── backend/
│   └── src/
│       ├── config/                  # Environment config, DB connection, constants
│       │
│       ├── controllers/             # Route handler logic (request → response)
│       │
│       ├── middleware/              # Auth guards, error handlers, validators
│       │
│       ├── models/                  # Database schemas / ORM models
│       │
│       ├── routes/                  # API route definitions
│       │
│       ├── services/                # Business logic layer
│       │
│       ├── utils/                   # Helper functions and shared utilities
│       │
│       └── validators/              # Input validation schemas (Joi / Zod)
│
├── .gitignore
└── README.md
```

---

## 🔑 Core Features

### 1. 🔐 User Authentication
- Signup / Login with email & password
- JWT token-based session management
- Secure password hashing with bcrypt

### 2. 💸 Income & Expense Tracking
- Add, edit, and delete transactions
- Categorize expenses (Food, Rent, Salary, Entertainment, etc.)
- Filter transactions by date and category

### 3. 📊 Budget Management
- Set monthly / weekly budgets per category
- Track spending against defined limits
- Alerts when nearing or exceeding budget

### 4. 📈 Dashboard & Insights
- Visual charts powered by Chart.js / Recharts
- Monthly income vs. expense summaries
- Expense distribution by category (pie / donut charts)
- Savings tracking over time

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kavithra1000/Personal-Finance-Tracker
cd Personal-Finance-Tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

Create a `.env` file in both the `frontend` and `backend` directories:

```env
# ── Backend ──────────────────────────────
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# ── Frontend ─────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---


## 📈 Future Enhancements

- [ ] Export reports as CSV / PDF
- [ ] Import bank statement as CSV / PDF
- [ ] Multi-currency support
- [ ] Dark mode UI

---

## 👨‍💻 Author

**Monal Kavithra Wickramasinghe**
Information Technology Undergraduate — SLIIT
