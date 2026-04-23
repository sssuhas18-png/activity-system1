# 🎓 Activity System

A role-based full-stack system for managing student activities, submissions, approvals, and dynamic point allocation.

---

## 🚀 Features

* Role-based access (Student / Admin)
* Activity submission workflow
* Approval & verification system
* Dynamic point allocation
* Prevention of duplicate submissions
* Scalable backend architecture

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Next.js (Frontend)

---

## 🧠 How It Works

1. Student submits an activity/certificate
2. Data is stored in MongoDB
3. Admin verifies the submission
4. Points are assigned dynamically based on criteria
5. System prevents duplicate submissions

---

## 📁 Project Structure

* `/Tracker` → Frontend (Next.js)
* `/backend` → APIs, controllers, models

---

## ⚙️ Setup

```bash
# Install dependencies
npm install

# Run backend
npm start

# Run frontend
cd Tracker
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_uri
```

---

## 🔮 Future Improvements

* Add real-time notifications
* Integrate rate limiting for API security
  
