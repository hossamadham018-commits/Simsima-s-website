# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "08123456789"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Errors:**
- `400` - User already exists

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

## Menu Endpoints

### Get All Menu Items
```http
GET /menu
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Nasi Goreng Special",
    "price": 25000,
    "category": "main",
    "description": "Fried rice with chicken and vegetables",
    "image": "/images/nasi-goreng.jpg"
  },
  {
    "id": 2,
    "name": "Ayam Bakar",
    "price": 30000,
    "category": "main",
    "description": "Grilled chicken with special sauce",
    "image": "/images/ayam-bakar.jpg"
  }
]
```

---

### Add Menu Item (Admin Only)
```http
POST /menu
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Sate Ayam",
  "price": 28000,
  "category": "main",
  "description": "Chicken satay with peanut sauce",
  "image": "/images/sate-ayam.jpg"
}
```

**Response (201):**
```json
{
  "id": 5,
  "name": "Sate Ayam",
  "price": 28000,
  "category": "main",
  "description": "Chicken satay with peanut sauce",
  "image": "/images/sate-ayam.jpg"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required

---

### Update Menu Item (Admin Only)
```http
PUT /menu/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Nasi Goreng Spesial",
  "price": 27000,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Nasi Goreng Spesial",
  "price": 27000,
  "category": "main",
  "description": "Updated description",
  "image": "/images/nasi-goreng.jpg"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Item not found

---

### Delete Menu Item (Admin Only)
```http
DELETE /menu/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Item deleted"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Item not found

---

## Order Endpoints

### Get Orders
```http
GET /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200) - For Customers:**
Returns only user's orders
```json
[
  {
    "id": 1,
    "userId": 2,
    "items": [
      {
        "id": 1,
        "name": "Nasi Goreng Special",
        "price": 25000,
        "quantity": 2
      }
    ],
    "total": 50000,
    "deliveryAddress": "Jl. Contoh No. 123, Jakarta",
    "status": "pending",
    "createdAt": "2026-09-13T10:30:00.000Z"
  }
]
```

**Response (200) - For Admins:**
Returns all orders

**Errors:**
- `401` - Not authenticated

---

### Create Order
```http
POST /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Nasi Goreng Special",
      "price": 25000,
      "quantity": 2
    },
    {
      "id": 2,
      "name": "Ayam Bakar",
      "price": 30000,
      "quantity": 1
    }
  ],
  "total": 80000,
  "deliveryAddress": "Jl. Contoh No. 123, Jakarta"
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 2,
  "items": [...],
  "total": 80000,
  "deliveryAddress": "Jl. Contoh No. 123, Jakarta",
  "status": "pending",
  "createdAt": "2026-09-13T10:30:00.000Z"
}
```

**Errors:**
- `401` - Not authenticated

---

### Update Order Status (Admin Only)
```http
PATCH /orders/:id/status
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Status Values:**
- `pending`
- `processing`
- `completed`
- `cancelled`

**Response (200):**
```json
{
  "id": 1,
  "userId": 2,
  "items": [...],
  "total": 80000,
  "deliveryAddress": "Jl. Contoh No. 123, Jakarta",
  "status": "processing",
  "createdAt": "2026-09-13T10:30:00.000Z"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Order not found

---

## Health Check

### Check API Status
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "Home Katering API is running"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Internal server error

---

## Categories

Menu items can have these categories:
- `main` - Main course
- `appetizer` - Appetizer
- `beverage` - Beverage
- `dessert` - Dessert

---

## Authentication Flow

1. **Register**: POST to `/auth/register`
2. **Login**: POST to `/auth/login` → Receive token
3. **Use token**: Include in Authorization header for protected endpoints
4. **Token expires**: After 24 hours, login again

---

## Rate Limiting

Currently no rate limiting implemented. For production, implement rate limiting to prevent abuse.

---

## CORS

CORS is enabled for all origins in development. Restrict in production:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User","phone":"08123456789"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Menu
```bash
curl http://localhost:5000/api/menu
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"id":1,"name":"Nasi Goreng","price":25000,"quantity":2}],"total":50000,"deliveryAddress":"Test Address"}'
```

---

## Postman Collection

You can import these endpoints into Postman for easier testing. Create a new collection and add these endpoints with the examples above.

---

For more information, see the main README.md file.
