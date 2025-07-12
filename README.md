# 📦 Mern-Ecommerce-Blue-Pottery

> An elegant full-stack E-commerce web application built with the MERN (MongoDB, Express.js, React, Node.js) stack. This project features a modern UI for selling unique **Blue Pottery** products with admin and user dashboards, secure authentication, cart management, payments, and more.

---

## 📸 Demo

> _Add screenshots or demo GIF here_  
*(Optional)*

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
