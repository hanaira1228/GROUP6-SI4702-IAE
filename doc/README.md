# 🧾 Food Delivery System - Documentation

Dokumentasi singkat mengenai struktur service, cara menjalankan sistem, port yang digunakan, dan dependensi antar service dalam proyek **Food Delivery System**.

---

## 📂 Daftar Service

| Service Name    | Deskripsi Singkat |
|-----------------|-------------------|
| **api-gateway** | Pintu utama yang mengatur routing request ke setiap microservice (User, Order, Restaurant). |
| **user-service** | Mengelola data pengguna (registrasi, login, profil). |
| **order-service** | Mengatur data pesanan makanan (pembuatan order, status order). |
| **restaurant-service** | Menyediakan data restoran dan menu makanan. |
| **frontend** | Aplikasi antarmuka pengguna berbasis Next.js untuk akses sistem Food Delivery. |

---

## ⚙️ Cara Menjalankan

1. **Clone Repository**
   ```bash
   git clone <url-repository>
   cd Food-Delivery-System


# API Gateway
cd api-gateway
npm install
npm start

# User Service
cd user-service
npm install
npm start

# Order Service
cd order-service
npm install
npm start

# Restaurant Service
cd restaurant-service
npm install
npm start

# Frontend (Next.js)
cd frontend
npm install
npm run dev


| Service            | Port   | URL                                            |
| ------------------ | ------ | ---------------------------------------------- |
| API Gateway        | `3000` | [http://localhost:3000](http://localhost:3000) |
| User Service       | `3001` | [http://localhost:3001](http://localhost:3001) |
| Order Service      | `3002` | [http://localhost:3002](http://localhost:3002) |
| Restaurant Service | `3003` | [http://localhost:3003](http://localhost:3003) |
| Frontend           | `3004` | [http://localhost:3004](http://localhost:3004) |



##  Dependensi Antar Service

| Service Name          | Deskripsi Singkat |
|------------------------|-------------------|
| **api-gateway**        | Pintu utama yang mengatur routing request ke setiap microservice (User, Order, Restaurant). |
| **user-service**       | Mengelola data pengguna (registrasi, login, profil). |
| **order-service**      | Mengatur data pesanan makanan (pembuatan order, status order). |
| **restaurant-service** | Menyediakan data restoran dan menu makanan. |
| **frontend**           | Aplikasi antarmuka pengguna berbasis Next.js untuk akses sistem Food Delivery. |


##  Dependensi Utama
- Node.js (v18+)
- Express.js
- MongoDB + Mongoose
- Dotenv
- Nodemon (dev dependency)
- React / Next.js (Frontend)
