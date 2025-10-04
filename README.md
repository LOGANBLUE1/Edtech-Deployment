# 🎓 EdTech Web App

A **full-stack EdTech platform** built using the **MERN stack**, designed for Students, Instructors, and Admins.  
This platform enables course creation, secure enrollment, and seamless payment integration — all deployed in scalable containers on **Google Cloud Run**.

---

## 🚀 Features

### 👤 User Roles
- **Students:** Browse, purchase, and access enrolled courses.
- **Instructors:** Create, manage, and publish courses.
- **Admins:** Oversee users, courses, and platform activity.

---

## 🔐 Authentication & Security
- Secure authentication and authorization using **JWT tokens** and **Google OAuth 2.0**.
- Passwords encrypted using **bcrypt**.
- Session management via **cookies** and **localStorage**.

---

## 💳 Payments & Communication
- Integrated **Razorpay** for secure payment processing.
- Automatic **email confirmations** using **Nodemailer** after successful transactions.

---

## ☁️ File Storage & Media Management
- Course thumbnails and assets stored using **Cloudinary**.
- Fully optimized for performance and scalability.

---

## 🧩 DevOps & Deployment
- Containerized using **Docker**.
- Deployed on **Google Cloud Run** for automatic scaling.
- Separate **dev** and **prod** environments with isolated databases and configurations.
- **CI/CD pipeline** set up to auto-build and deploy on each Git push.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React.js, Redux, TailwindCSS |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB |
| **Auth & Security** | JWT, Google OAuth 2.0, bcrypt |
| **Payments** | Razorpay |
| **File Storage** | Cloudinary |
| **DevOps & Deployment** | Docker, Google Cloud Run, GitHub Actions |
| **Email Service** | Nodemailer |

---

## 🧪 Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/LOGANBLUE1/Edtech-Deployment.git
cd Edtech-Deployment
```
### 2. Set up environment variables
Create a `.env` file in both the `client` and `server` directories with the following variables:
#### Sever `.env`
Here's a sample `.env` file for the server:
```env

CLOUD_NAME = drkjvozea
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
MONGODB_URL="mongodb+srv://adityafake____:CumJDQ6xL3Hs9JCP@cluster0.djs7m.mongodb.net/EdTech-dev"
PORT = 4000
MAIL_HOST = smtp.gmail.com
COMPANY_NAME = "Career Counselling"
MAIL_USER = 
MAIL_PASS =
JWT_SECRET = 
CLOUDINARY_FOLDER_NAME =
RAZORPAY_KEY =         
RAZORPAY_SECRET =
```
#### Client `.env`
Here's a sample `.env` file for the client:
```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_ENV=
REACT_APP_TEST=
REACT_APP_GOOGLE_CLIENT_ID=fake____-iob86bhmrc3pk1ottpf0eggvcm6k968u.apps.googleusercontent.com
PORT=
```
### 2. Run the server
```bash
cd server
npm install
npm run dev
```

### 3. Run the client
```bash
cd client
npm install
npm start
```
