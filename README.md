# Food Delivery System - GROUP6-SI4702-IAE

Sistem delivery makanan berbasis microservices dengan API Gateway, menggunakan Node.js/Express untuk backend dan Next.js untuk frontend.

## 📋 Daftar Isi
- [Arsitektur Sistem](#arsitektur-sistem)
- [Service Overview](#service-overview)
- [Requirements](#requirements)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Port dan Konfigurasi](#port-dan-konfigurasi)
- [API Documentation](#api-documentation)
- [Testing dengan Postman](#testing-dengan-postman)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│                    Port: 3004 (custom)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Express.js)                        │
│              Port: 3000 (with proxy)                         │
└──┬──────────────────────┬──────────────────────┬────────────┘
   │                      │                      │
   ▼                      ▼                      ▼
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  User Service   │ │Restaurant Service│ │  Order Service   │
│  Port: 3001     │ │  Port: 3002      │ │  Port: 3003      │
└─────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 📦 Service Overview

### 1. **API Gateway** (`api-gateway/`)
**Deskripsi:** Pintu masuk utama untuk semua request API. Gateway ini meneruskan request ke microservices yang sesuai.

**Fitur:**
- Proxy routing ke semua microservices
- HTTP middleware (body parsing, URL encoding)
- Header forwarding (x-forwarded-for)
- Health check endpoint

**Dependencies:**
- `express` - Web framework
- `http-proxy-middleware` - Proxy requests

**Port:** 3000

**Variabel Environment:**
```
API_GATEWAY_PORT=3000
USER_SERVICE_URL=http://localhost:3001
RESTAURANT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
```

---

### 2. **User Service** (`user-service/`)
**Deskripsi:** Mengelola data user/customer dan admin sistem.

**Fitur:**
- CRUD operations untuk user
- Validasi data user
- Admin seeder untuk initial data
- User model dengan role-based access

**Dependencies:**
- `express` - Web framework
- `body-parser` - Parse request body
- Database driver (sesuai konfigurasi)

**Port:** 3001

**Endpoint:**
- `GET /users` - Ambil semua user
- `POST /users` - Buat user baru
- `GET /users/:id` - Ambil user berdasarkan ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Hapus user

---

### 3. **Restaurant Service** (`restaurant-service/`)
**Deskripsi:** Mengelola data restaurant dan menu.

**Fitur:**
- CRUD operations untuk restaurant
- Management menu makanan
- Rating dan review restaurant
- Operating hours management

**Dependencies:**
- `express` - Web framework
- `body-parser` - Parse request body
- Database driver

**Port:** 3002

**Endpoint:**
- `GET /restaurants` - Ambil semua restaurant
- `POST /restaurants` - Buat restaurant baru
- `GET /restaurants/:id` - Ambil restaurant berdasarkan ID
- `PUT /restaurants/:id` - Update restaurant berdasarkan ID
- `DELETE /restaurants/:id` - Hapus restaurant berdasarkan ID
- `GET /restaurants/menus` - Ambil semua menu dari semua restaurant
- `POST /restaurants/:restaurantId/menus` - Buat menu baru berdasarkan ID restaurant 
- `GET /restaurants/:restaurantId/menus` - Ambil semua menu berdasarkan ID restaurant

---

### 4. **Order Service** (`order-service/`)
**Deskripsi:** Mengelola pesanan/order dari customer.

**Fitur:**
- CRUD operations untuk order
- Status tracking order
- Order history
- Payment method handling

**Dependencies:**
- `express` - Web framework
- `body-parser` - Parse request body
- Database driver

**Port:** 3003

**Endpoint:**
- `GET /orders` - Ambil semua order
- `POST /orders` - Buat order baru
- `GET /orders/:id` - Ambil order berdasarkan ID
- `PUT /orders/:id` - Update status order
- `DELETE /orders/:id` - Cancel order

---

### 5. **Frontend** (`frontend/`)
**Deskripsi:** Interface web aplikasi food delivery menggunakan Next.js.

**Fitur:**
- Server-side rendering (SSR)
- TypeScript support
- Responsive design
- Components reusable

**Dependencies:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type checking
- ESLint & PostCSS - Code quality & styling

**Port:** 3000 (atau custom jika ada conflict)

**Pages:**
- `/` - Home page
- `/menu` - Daftar menu
- `/restaurant` - Daftar restaurant
- `/user` - User profile
- `/input` - Form input

---

## 📋 Requirements

### Sistem Operasi
- Windows 10/11, macOS, atau Linux

### Software yang Harus Diinstal
- **Node.js** v16.x atau lebih tinggi
- **npm** v7.x atau lebih tinggi
- **Git** (opsional, untuk clone repository)

### Cek Instalasi
```bash
node -v
npm -v
```

---

## 🚀 Instalasi

### Opsi 1: Manual Install Dependencies

Jalankan perintah berikut di setiap folder service:

```bash
# User Service
cd user-service
npm install

# Restaurant Service
cd ../restaurant-service
npm install

# Order Service
cd ../order-service
npm install

# API Gateway
cd ../api-gateway
npm install

# Frontend
cd ../frontend
npm install
```

### Opsi 2: Install Semua Sekaligus (Windows)
```bash
# Di root folder project, jalankan script batch
script.bat
```

---

## ▶️ Menjalankan Aplikasi

### Opsi 1: Jalankan Manual (Tiap Service di Terminal Terpisah)

**Terminal 1 - User Service:**
```bash
cd user-service
npm start
# atau gunakan nodemon untuk development
npm run dev
```

**Terminal 2 - Restaurant Service:**
```bash
cd restaurant-service
npm start
# atau
npm run dev
```

**Terminal 3 - Order Service:**
```bash
cd order-service
npm start
# atau
npm run dev
```

**Terminal 4 - API Gateway:**
```bash
cd api-gateway
npm start
# atau
npm run dev
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opsi 2: Gunakan Script Batch (Windows)

Di root folder project:
```bash
script.bat
```

Script ini akan membuka 5 jendela command terpisah dan menjalankan semua service secara otomatis.

### Opsi 3: Jalankan Frontend Only (Development)
```bash
cd frontend
npm run dev
```

Akses di browser: `http://localhost:3000`

---

## 🔌 Port dan Konfigurasi

| Service | Port | Deskripsi | Environment |
|---------|------|-----------|-------------|
| API Gateway | 3000 | Main entry point | `API_GATEWAY_PORT` |
| User Service | 3001 | User management | `USER_SERVICE_URL` |
| Restaurant Service | 3002 | Restaurant data | `RESTAURANT_SERVICE_URL` |
| Order Service | 3003 | Order management | `ORDER_SERVICE_URL` |
| Frontend (Next.js) | 3004 (custom) | Web UI | Custom port jika conflict |

### Mengubah Port

**API Gateway (`.env`):**
```
API_GATEWAY_PORT=3000
USER_SERVICE_URL=http://localhost:3001
RESTAURANT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
```

**Frontend (Next.js):**
```bash
npm run dev -- -p 3004
```

---

## 📚 API Documentation

### Base URL
- Gateway: `http://localhost:3000`

### User Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Ambil semua user |
| POST | `/api/users` | Buat user baru |
| GET | `/api/users/:id` | Ambil user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Hapus user |

### Restaurant Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | Ambil semua restaurant |
| POST | `/api/restaurants` | Buat restaurant baru |
| GET | `/api/restaurants/:id` | Ambil restaurant by ID |
| PUT | `/api/restaurants/:id` | Update restaurant |
| DELETE | `/api/restaurants/:id` | Hapus restaurant |

### Order Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Ambil semua order |
| POST | `/api/orders` | Buat order baru |
| GET | `/api/orders/:id` | Ambil order by ID |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Cancel order |

### Gateway Health Check

```bash
GET http://localhost:3000/
```

Response:
```json
{
  "service": "api-gateway",
  "routes": ["/api/users", "/api/restaurants", "/api/orders"],
  "targets": {
    "userService": "http://localhost:3001",
    "restaurantService": "http://localhost:3002",
    "orderService": "http://localhost:3003"
  }
}
```

---

## 🧪 Testing dengan Postman

### Import Collection

1. Buka Postman
2. Click **Import** atau tekan `Ctrl+O`
3. Pilih file `doc/Food_Delivery_API_Collection.postman_collection.json`
4. Collection akan dimuat dengan semua folder endpoint

### Sample Request Bodies

**Create User:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789",
  "address": "Jln. Raya No. 123, Jakarta",
  "role": "customer"
}
```

**Create Restaurant:**
```json
{
  "name": "Warung Makan Sejahtera",
  "category": "Indonesian",
  "address": "Jln. Gatot Subroto No. 1, Jakarta",
  "phone": "021-1234567",
  "rating": 4.5,
  "operatingHours": "10:00 - 22:00",
  "isOpen": true
}
```

**Create Order:**
```json
{
  "userId": 1,
  "restaurantId": 1,
  "items": [
    {
      "menuId": 1,
      "quantity": 2,
      "price": 25000
    }
  ],
  "totalPrice": 65000,
  "deliveryAddress": "Jln. Sudirman No. 789, Jakarta",
  "paymentMethod": "credit_card",
  "notes": "Jangan pakai sambal"
}
```

---

## 🐛 Troubleshooting

### 1. "npm is not recognized"
**Solusi:**
```bash
# Instal Node.js dari https://nodejs.org/
# atau gunakan winget (Windows)
winget install OpenJS.NodeJS.LTS -e

# Restart terminal dan cek versi
node -v
npm -v
```

### 2. "EADDRINUSE: address already in use"
Port sudah digunakan oleh proses lain.

**Solusi:**
```bash
# Windows - Cari process yang memakai port 3000
netstat -ano | findstr :3000

# Matikan process
taskkill /PID <PID> /F

# Atau gunakan port berbeda
npm run dev -- -p 3001
```

### 3. "ECONNREFUSED" dari Gateway
Service target belum berjalan.

**Solusi:**
- Pastikan semua 4 service backend sedang berjalan (user, restaurant, order)
- Cek di `.env` gateway bahwa URL service target sudah benar
- Lihat log terminal masing-masing service untuk error

### 4. "Cannot find module"
Dependencies belum terinstal.

**Solusi:**
```bash
npm cache clean --force
npm install
```

### 5. Frontend tidak terhubung ke API Gateway
CORS atau proxy issue.

**Solusi:**
- Pastikan API Gateway berjalan di port 3000
- Cek console browser untuk error message
- Verifikasi endpoint di Network tab DevTools

### 6. "Module not found: @/components"
TypeScript path alias tidak terkonfigurasi.

**Solusi:**
- Cek `tsconfig.json` di folder frontend
- Pastikan path "@/*" mengarah ke folder `components/`

---

## 📁 Struktur Folder

```
GROUP6-SI4702-IAE/
├── api-gateway/
│   ├── api-gateway.js
│   ├── .env
│   └── package.json
├── user-service/
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── restaurant-service/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── package.json
├── order-service/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── package.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
├── doc/
│   ├── README.md
│   └── Food_Delivery_API_Collection.postman_collection.json
├── script.bat
└── README.md
```

---

## 🔗 Reference Links

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [Postman Documentation](https://learning.postman.com/)

---

## 👥 Contributors
- GROUP6 - SI4702 (IAE)

---

## 📝 License
MIT License

---

## 💡 Tips & Best Practices

1. **Selalu jalankan semua 4 service backend sebelum mengakses frontend**
2. **Gunakan Postman untuk testing API sebelum integrasi ke frontend**
3. **Monitor terminal untuk melihat request logs di API Gateway**
4. **Gunakan `npm run dev` untuk development dengan auto-reload**
5. **Jangan komit file `.env` - gunakan `.env.example` sebagai template**

---

**Pertanyaan atau Issue?** Silakan periksa section [Troubleshooting](#troubleshooting) atau lihat log di terminal.

Happy coding! 🚀
