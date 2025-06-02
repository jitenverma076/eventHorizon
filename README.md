# EventHorizon Ticketing Platform

A modern, full-stack event ticketing solution that simplifies event management and ticket purchasing. Built with the MERN stack (MongoDB, Express.js, React, Node.js), EventHorizon offers a seamless experience for both event organizers and attendees.

## 🌟 Features

- **User Authentication** - Secure signup/login with JWT
- **Event Management** - Create, view, update, and delete events
- **Ticket Booking** - Intuitive ticket purchasing flow
- **Waitlist** - Join waitlists for sold-out events
- **Referral System** - Invite friends and earn rewards
- **Analytics Dashboard** - Track event performance and sales
- **QR Code Integration** - For quick event check-ins
- **Responsive Design** - Works on all devices

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for email notifications
- QR Code generation
- Rate limiting and security middleware

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventhorizon-ticketing-platform.git
   cd eventhorizon-ticketing-platform
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cp .env.example .env
   # Update .env with your configuration
   npm install
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../
   cp .env.example .env
   # Update VITE_API_BASE_URL in .env
   npm install
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:5173`

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
# Add other frontend environment variables here
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:5173
```

## 📦 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
