🛒 E-commerce API

A RESTful backend for an e-commerce application built with Node.js, Express, TypeScript, PostgreSQL, Prisma, and Redis, featuring authentication, product management, cart functionality, order checkout with Stripe, and more.

🚀 Features

User Authentication – JWT-based login, registration, refresh token, and logout.

Role-Based Authorization – Admin and user role separation with protected routes.

Product Management – CRUD operations with Cloudinary image upload support.

Category Management – Add, edit, delete, and fetch product categories.

Shopping Cart – Add, update, remove items, and clear the cart.

Order Checkout – Stripe Checkout integration with webhook confirmation.

Caching – Redis caching for product, category, order, and cart endpoints.

Admin Panel (API) – View all users and orders (admin-only routes).

🧱 Tech Stack

Backend: Node.js, Express, TypeScript

Database: PostgreSQL + Prisma ORM

Auth: JWT (Access & Refresh Tokens)

Payment: Stripe Checkout + Webhook

Caching: Redis

Image Upload: Cloudinary

Deployment: Render

Dev Tools: Postman, Prisma Studio

📦 API Endpoints

🔐 Auth

Method	Route	Description

POST	/register	Register new user

POST	/login	Login with credentials

GET	/refeshToken	Get new access token

DELETE	/logout	Logout user

GET	/me	Get current user

👥 Users (Admin only)

Method	Route	Description

GET	/users	Get all users

GET	/:id	Get user by ID

DELETE	/:id	Delete user by ID

🛍️ Products

Method	Route	Description

GET	/	Get all products (cached)

GET	/:id	Get single product

POST	/	Create product (admin only)

PUT	/:id	Update product

DELETE	/:id	Delete product

✅ Supports image upload via multipart/form-data using Cloudinary.

📂 Categories

Method	Route	Description

GET	/	Get all categories (cached)

POST	/	Create category

PUT	/:id	Update category

DELETE	/:id	Delete category

🛒 Cart

Method	Route	Description

GET	/	Get cart items (cached)

POST	/:id	Add item to cart

PUT	/:id	Update cart item quantity

DELETE	/:id	Remove item from cart

DELETE	/	Clear all cart items

📦 Orders

Method	Route	Description

POST	/checkout	Create Stripe checkout session

GET	/	Get orders for current user

GET	/:id	Get specific order details

GET	/all/admin	Admin: Get all orders

💳 Stripe Webhook

Method	Route	Description
POST	/	Handle Stripe event
