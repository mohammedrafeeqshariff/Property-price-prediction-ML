# 🏟️ Turf Management System

A comprehensive full-stack solution for managing and booking sports turfs. This platform bridges the gap between turf owners and sports enthusiasts, providing a seamless experience for arena discovery, booking management, and owner operations.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Animations**: [React Spring](https://www.react-spring.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

### Backend & Infrastructure
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [Appwrite](https://appwrite.io/) (Session Management) & [Firebase](https://firebase.google.com/) (Google Auth)
- **File Storage**: [Appwrite Storage](https://appwrite.io/docs/products/storage)
- **Utilities**: Joi (Validation), Multer (File Uploads), Axios (API calls)

---

## ✨ Key Features

### 👤 For Users
- **Arena Discovery**: Explore available turfs with detailed info and images.
- **Smart Booking**: Interactive calendar-based booking system.
- **AI Assistant**: Specialized AI ChatBot to help find the right turf and answer queries.
- **Booking History**: Track and manage all past and upcoming sessions.
- **Dynamic Profile**: Manage personal info and preferences.

### 🏢 For Turf Owners (Command Center)
- **Asset Control**: Full lifecycle management of turf listings.
- **Deploy Arena**: Effortless onboarding flow for new sports facilities.
- **Real-time Analytics**: Monitor bookings and revenue through the owner dashboard.
- **Modular Console**: Sleek, high-performance interface for complex operations.

---

## 🛠️ Workflows & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Appwrite Project
- Firebase Project

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd S51_Mohammed_Capstone_Turf
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create .env with MONGODB_URI, APPWRITE_ENDPOINT/PROJECT_ID, etc.
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Client
   npm install
   # Create .env with VITE_APPWRITE_ENDPOINT, VITE_FIREBASE_CONFIG, etc.
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── Backend
│   ├── config       # Database and service configs
│   ├── controllers  # Request handling logic
│   ├── models       # Mongoose schemas
│   ├── routes       # API endpoints (Auth, Turf, Bookings)
│   └── middlewares  # Error handling and Auth guards
├── Client
│   ├── src
│   │   ├── components # Reusable UI components
│   │   ├── features   # Redux logic (auth, etc.)
│   │   ├── pages      # Main application views
│   │   └── services   # API integration layer
```
