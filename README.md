# 📦 Mern-Ecommerce-Blue-Pottery

> An elegant full-stack E-commerce web application built with the MERN (MongoDB, Express.js, React, Node.js) stack. This project features a modern UI for selling unique **Blue Pottery** products with admin and user dashboards, secure authentication, cart management, payments, and more.

---

## 🚀 Features

- 🛍️ Full E-Commerce Functionality (Products, Categories, Cart, Orders)
- 👨‍💼 Admin Dashboard (Add/Edit/Delete Products, Orders)
- 🔐 JWT Authentication with Secure Login/Register
- 🧾 Order Summary and Checkout
- 📦 Stock & Inventory Management
- 📱 Responsive UI built with React, Bootstrap & Tailwind (optional)
- 🧑‍💻 RESTful APIs using Express & MongoDB

---

## 🛠️ Tech Stack

**Frontend:**
- React.js  
- Redux Toolkit  
- React Router  
- Bootstrap

**Backend:**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JSON Web Token (JWT)  
- Multer (for image uploads)

---

## 📂 Project Structure
```bash
Mern-Ecommerce-Blue-Pottery/
│
├── backend/ # Express backend (API, DB, Auth)
│ ├── config/ # DB & JWT config
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & error handling
│ └── server.js # Entry point
│
├── frontend/ # React frontend
│ ├── components/ # UI components
│ ├── screens/ # Pages
│ ├── redux/ # Redux state slices
│ └── App.js # Main app
│
├── .env # Environment variables
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ahm3d-khanzada/Mern-Ecommerce-Blue-Pottery.git
cd Mern-Ecommerce-Blue-Pottery
```
### 2. Setup the backend
```bash
cd backend
npm install
```
Create a .env file in backend/ with:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_key
```
Start the backend server:
```bash
npm run dev
```
### 3. Setup the frontend
```bash
cd ../frontend
npm install
npm start
```
## 🔐 Authentication Features

- Register/Login with hashed passwords
- JWT Token Storage in HTTP-Only Cookies
- Protected Routes for Admin/User

## 🪪 License
MIT License © Ahmed Khanzada
---

Would you like me to:
- Generate a ready-to-download `README.md` file?
- Add shields.io badges (React, Node, Mongo, License, etc)?
- Add a live preview GIF/image section?

Let me know!
