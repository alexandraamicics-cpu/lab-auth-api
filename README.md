📄 README.md
# Lab Auth API


A simple authentication API built with **Node.js**, **Express**, **MySQL**, and **JWT**.  
It supports **signup, login, logout, and profile** endpoints with password hashing (bcrypt) and token revocation.


---


## 🚀 Setup


1. Clone this repo:
   ```bash
   git clone https://github.com/<username>/lab-auth-api.git
   cd lab-auth-api


Install dependencies:

 npm install


Configure database:


Create a MySQL database (e.g., lab_auth).


Run the users and revoked_tokens table migrations:


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120),
  role VARCHAR(30) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE revoked_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jti VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL
);


Copy .env.example to .env and fill in your values:

 cp .env.example .env


Start server:

 npm start



📌 Endpoints
POST /signup
Registers a new user.
 Body:
{
  "email": "user1@example.com",
  "password": "Pass@1234",
  "full_name": "User One",
  "role": "student"
}


POST /login
Logs in a user, returns a JWT token.
 Body:
{
  "email": "user1@example.com",
  "password": "Pass@1234"
}


POST /logout
Revokes a token (requires Authorization header).
GET /profile
Returns user info.
Needs Authorization: Bearer <token>.


Responds 401 if no token, tampered, or expired.



🛠 Tech Stack
Node.js


Express


MySQL


JWT


bcryptjs




---


### 📄 **.env.example**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=lab_auth
JWT_SECRET=your_secret_key
PORT=3000


