# TaskFlow

A simple, clean, and production-quality Todo application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). 

TaskFlow is designed to feel natural, minimal, practical, and visually polished without overwhelming animations or AI-generated design clichés. It provides secure user authentication, intuitive task management, priority tracking, instant search, and status filtering.

---

## Features

- **User Authentication:** Secure user signup and login with hashed passwords.
- **JWT Authorization:** JSON Web Token based stateless authentication protecting all private task endpoints.
- **Task Management (CRUD):**
  - Create new tasks with title, description, and priority level.
  - Read user-specific tasks (each user only sees their own tasks).
  - Update task details, toggle completed status, or change priority level.
  - Delete tasks with immediate UI updates.
- **Task Priorities:** Organize tasks with `Low`, `Medium`, or `High` priority badges and inline priority updating.
- **Instant Search:** Real-time search filter matching task titles.
- **Filter Tabs:** Quick navigation between `All`, `Pending`, `Completed`, and `High Priority` tasks with live count badges.
- **Clean Summary Stats:** Compact overview cards for Total Tasks, Completed, Pending, and High Priority.
- **Responsive UI:** Fully responsive layout with custom vanilla CSS crafted for mobile, tablet, laptop, and desktop viewports.
- **Human-Designed Polish:** Built with gentle off-white backgrounds, dark navy typography, subtle borders, and smooth transitions.

---

## Tech Stack

### Backend
- **Node.js**: Asynchronous JavaScript runtime environment.
- **Express.js**: Fast, minimalist web framework for building REST APIs.
- **MongoDB & Mongoose**: NoSQL document database with schema validation and query modeling.
- **JWT (jsonwebtoken)**: Token-based stateless authentication.
- **bcryptjs**: Salt generation and one-way password hashing.
- **cors & dotenv**: Cross-origin resource sharing and environment variable management.

### Frontend
- **React.js**: Functional UI components with modern React Hooks (`useState`, `useEffect`).
- **React Router**: Client-side routing with protected routes and redirects (`react-router-dom`).
- **Vanilla CSS**: Clean, easy-to-read, standard CSS with zero external UI dependencies (no Tailwind, Bootstrap, or Material UI).
- **Fetch API**: Clean, modular API service layer.

---

## Project Structure

```
taskflow/
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic using Mongoose
│   ├── controllers/
│   │   ├── authController.js   # Signup, login, password comparison, and JWT generation
│   │   └── taskController.js   # CRUD operations for authenticated user tasks
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT token verification middleware
│   ├── models/
│   │   ├── User.js             # Mongoose schema for User
│   │   └── Task.js             # Mongoose schema for Task
│   ├── routes/
│   │   ├── authRoutes.js       # Routes for /api/auth/signup & /api/auth/login
│   │   └── taskRoutes.js       # Protected routes for /api/tasks
│   ├── .env                    # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js               # Express application entry point
│   └── package.json            # Backend scripts and dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx      # Top navigation with user greeting and logout
    │   │   ├── TaskForm.jsx    # Form to create new tasks with priority
    │   │   ├── TaskItem.jsx    # Individual task card with status, badges, actions
    │   │   └── TaskList.jsx    # List renderer with search and category filters
    │   ├── pages/
    │   │   ├── Login.jsx       # Login view with split brand illustration
    │   │   ├── Signup.jsx      # Account registration view with validations
    │   │   └── Dashboard.jsx   # Main productivity dashboard with stats & tasks
    │   ├── services/
    │   │   └── api.js          # Centralized HTTP request service with token headers
    │   ├── App.jsx             # React Router routing configuration
    │   ├── main.jsx            # React root mount
    │   └── index.css           # Clean vanilla CSS stylesheet
    └── package.json            # Frontend scripts and dependencies
```

---

## How to Install & Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB Atlas account (free tier) OR a local MongoDB instance

---

### Step 1: Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd taskflow/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Open or create `.env` in `taskflow/backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=my_taskflow_jwt_secret_key_2026
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: If `MONGO_URI` is left blank, the application will automatically run in local fallback mode so you can demo it immediately!)*

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will start on **`http://localhost:5000`**.

---

### Step 2: Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd taskflow/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will start on **`http://localhost:5173`** (or the port specified by Vite).

---

## Detailed Explanations for College Presentations & Interviews

### 1. How to Create a MongoDB Database (Atlas Free Tier)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Click **Create a Deployment** and select the **M0 Free Cluster**.
3. Choose your preferred region and click **Create**.
4. In the **Security Quickstart**:
   - Create a database user with a username and strong password (note these down).
   - Under **IP Access List**, click **Add My Current IP Address** or allow access from anywhere (`0.0.0.0/0`) for development.
5. Go to your **Database Deployments**, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your database user credentials and paste it into `MONGO_URI` in `backend/.env`.

---

### 2. How to Configure the `.env` File
Environment variables store sensitive configuration parameters outside of source control:
- **`PORT`**: The network port where Express listens (e.g. `5000`).
- **`MONGO_URI`**: The secret connection URL containing database address and credentials.
- **`JWT_SECRET`**: A private cryptographic key used by `jsonwebtoken` to sign and verify authentication tokens.
- **Why this matters**: Hardcoding secrets into source code allows anyone with repository access to breach your database. `.env` is listed in `.gitignore` to prevent committing secrets to GitHub.

---

### 3. How JWT (JSON Web Token) Authentication Works
1. **User Signup / Login**:
   - The client submits email and password.
   - For signup: `bcryptjs` generates a salt and hashes the plain password before saving to MongoDB.
   - For login: `bcryptjs.compare()` verifies the entered password against the stored hash.
2. **Token Generation**:
   - The server signs a payload `{ id: user._id, email: user.email }` using `jwt.sign()` and the private `JWT_SECRET`.
   - The token contains three parts separated by dots: **Header**, **Payload**, and **Signature**.
3. **Client Storage**:
   - The frontend stores the token in browser `localStorage`.
4. **Protected Requests**:
   - For any protected action (e.g. `GET /api/tasks`, `POST /api/tasks`), the frontend attaches the header:
     `Authorization: Bearer <token>`.
5. **Server Verification (`authMiddleware.js`)**:
   - The server extracts the token from the `Authorization` header.
   - It validates the signature using `jwt.verify(token, JWT_SECRET)`.
   - If valid, `req.user` is populated with the authenticated user ID and the request proceeds to the controller.
   - If invalid or expired, the server responds with HTTP 401 Unauthorized.

---

### 4. How the Frontend Communicates with the Backend
- **Centralized API Service (`src/services/api.js`)**:
  Instead of writing raw `fetch` calls in every component, all endpoints are centralized into clean helper functions: `signup()`, `login()`, `getTasks()`, `createTask()`, `updateTask()`, and `deleteTask()`.
- **Request Flow**:
  1. A user interaction triggers an event handler (e.g. submitting `TaskForm.jsx`).
  2. The component calls `createTask({ title, description, priority })`.
  3. The `request` helper in `api.js` automatically retrieves the JWT from `localStorage` and appends `Authorization: Bearer <token>` and `Content-Type: application/json`.
  4. The Express server processes the request, performs CRUD on MongoDB, and returns JSON.
  5. The React state (`tasks`) is updated, which immediately re-renders the UI with the new task card.
