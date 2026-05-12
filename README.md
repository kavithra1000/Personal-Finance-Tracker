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
│   │
│   └── src/
│       ├── assets/                  # Static files: images, icons, fonts
│       │
│       ├── components/              # Reusable UI components
│       │   ├── budgets/             # Budget cards, progress bars, limit forms
│       │   ├── categories/          # Category badges, icons, selectors
│       │   ├── dashboard/           # Summary cards, charts, widgets
│       │   ├── transactions/        # Transaction list, form, filters
│       │
│       ├── pages/                   # React page components
│       │
│       ├── store/                   # Global state management (Redux / Zustand
│       │
│       ├── lib/                     # External library configs and API clients
│       │
│       ├── App.jsx                  # Main app component
│       ├── main.jsx                 # React app entry point
│       └── index.css                # Global styles
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
│       └── utils/                   # Helper functions and shared utilities
│
├── .gitignore
├── README.md
├── package.json
└── docker-compose.yml               # Optional container setup
```

---

## 🔑 Core Features

### 1. User Authentication
- Signup / Login with email & password
- JWT token-based session management
- Secure password hashing with bcrypt

### 2. Income & Expense Tracking
- Add, edit, and delete transactions
- Categorize expenses (Food, Rent, Salary, Entertainment, etc.)
- Filter transactions by date and category

### 3. Budget Management
- Set monthly / weekly budgets per category
- Track spending against defined limits
- Alerts when nearing or exceeding budget

### 4. Category Management
- Set category with monthly / weekly budgets
- View, and update category with monthly limits.

### 5. Dashboard & Insights
- Visual charts powered by Recharts
- Monthly income vs. expense summaries
- Expense distribution by category (pie / donut charts)
- Savings tracking over time

### 5. Reports
- Generate reports for transactions, budgets, and financial trends.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Postman
- **Storage**: Cloudinary
- **UI**: Tailwind, Rechart, Framer
- **Tools**: git, Github, VS code, Antigravity

---

## API Endpoints

### Authentication 

- **Register User**: `POST /auth/signup`
- **Login User**: `POST /auth/signin`
- **Logout User**: `PUT /auth/logout`
- **Get User Profile**: `GET /auth/profile`
- **Get User**: `DELETE /auth/me`

### Transactions

- **Create Transaction**: `POST /transactions/`
- **Get All Transactions**: `GET /transactions/`
- **Update Transaction**: `PUT /transactions/updatetransaction/:id`
- **Delete Transaction**: `DELETE /transactions/deletetransaction/:id`

### Budget Management

- **Create Budget**: `POST /budget/`
- **Get All Budgets**: `GET /budget/`
- **Update Budget**: `PUT /budget/:id`
- **Delete Budget**: `DELETE /budget/:id`

### Category Management

- **Create Category**: `POST /category/`
- **Get All Category**: `GET /category/`
- **Update Category**: `PUT /category/:id`
- **Delete Category**: `DELETE /category/:id`
- **Get Specific Category**: `GET /category/:id`
- **Category exists**: `GET /category/check-exists`

### Insights Management

- **Create Insights**: `GET /insights/summary`
- **Get All Insights**: `GET /insights/expense-distribution`
- **Update Insights**: `GET /insights/monthly-trend`
- **Delete Insights**: `GET /insights/budget-vs-actual`
- **Get Specific Insights**: `GET /insights/reports`

---

## ⚙️ Installation & Setup

### 1. Prerequisites

- Node.js installed
- MongoDB Atlas database
- Cloudinary Storage

### 2. Clone the Repository

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

Create a `.env` file `backend` directory:

```env
# ── Backend ──────────────────────────────
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_your_cloudinary_secret_key
```
---

## 📈 Future Enhancements

- [ ] Import bank statement as CSV / PDF
- [ ] Multi-currency, language support
- [ ] Notification support
- [ ] Dark mode UI

---

## Contributing

Feel free to submit pull requests or issues for improvements.

## 👨‍💻 Author

**Monal Kavithra Wickramasinghe**
Information Technology Undergraduate — SLIIT
