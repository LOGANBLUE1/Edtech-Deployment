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
| **Frontend** | React.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth & Security** | JWT, Google OAuth 2.0, bcrypt |
| **Payments** | Razorpay |
| **File Storage** | Cloudinary |
| **DevOps & Deployment** | Docker, Google Cloud Run, GitHub Actions |
| **Email Service** | Nodemailer |

---

## 🧪 Project Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/LOGANBLUE1/Edtech-Deployment.git
cd Edtech-Deployment
