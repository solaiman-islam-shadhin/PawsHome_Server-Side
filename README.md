# 🐾 PawsHome - Pet Adoption Platform

A comprehensive MERN stack web application that connects loving families with pets in need of forever homes. Built with modern technologies and best practices to create a seamless pet adoption experience.

## 🌟 Live Demo

- **Frontend**: [https://petsite-9e5cd.web.app/](https://petsite-9e5cd.web.app/)


## 🎯 Purpose

PawsHome aims to reduce pet homelessness by providing a user-friendly platform where:
- Pet owners can list pets for adoption
- Families can browse and adopt pets
- Communities can support pet care through donations
- Administrators can manage the platform effectively

## ✨ Key Features

### 🏠 Public Features
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Pet Browsing**: Search and filter pets by name, category, and location
- **Infinite Scrolling**: Seamless browsing experience with automatic content loading
- **Pet Details**: Comprehensive pet information with adoption requests
- **Donation Campaigns**: Support pet care through secure Stripe payments
- **Dark/Light Mode**: Toggle between themes for better user experience

### 🔐 Authentication & Security
- **Firebase Authentication**: Email/password and Google OAuth
- **JWT Integration**: Secure API communication
- **Role-based Access**: User and Admin roles with appropriate permissions
- **Protected Routes**: Secure access to dashboard and admin features

### 👤 User Dashboard
- **Pet Management**: Add, edit, delete, and mark pets as adopted
- **Adoption Requests**: Manage incoming adoption requests
- **Donation Campaigns**: Create and manage fundraising campaigns
- **My Donations**: Track personal donation history
- **Profile Management**: Update user information and preferences

### 👑 Admin Dashboard
- **User Management**: View all users, promote to admin, ban users
- **Pet Oversight**: Manage all pets across the platform
- **Donation Control**: Oversee all donation campaigns
- **Platform Analytics**: Monitor platform activity and statistics

### 🛠 Technical Features
- **Infinite Scrolling**: Implemented with TanStack Query and Intersection Observer
- **Real-time Updates**: Optimistic updates and cache invalidation
- **Image Upload**: Secure image hosting with ImgBB API
- **Rich Text Editor**: Markdown support for detailed descriptions
- **Loading States**: Skeleton loaders instead of spinners
- **Error Handling**: Comprehensive error management with user feedback
- **Form Validation**: Client-side validation with Yup schemas

## 🚀 Technologies Used

### Frontend
- **React 19** - Latest React with modern features
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Advanced table functionality
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **Yup** - Schema validation
- **Headless UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **MDEditor** - Markdown editing capabilities
- **React Loading Skeleton** - Loading state management
- **Stripe React** - Payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Firebase Admin** - Authentication verification
- **Stripe** - Payment processing
- **JWT** - JSON Web Tokens
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Compression** - Response compression

### Development & Deployment
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Nodemon** - Development server
- **Vercel** - Frontend deployment
- **Heroku** - Backend deployment
- **Git** - Version control

## 📦 NPM Packages

### Client Dependencies
```json
{
  "@headlessui/react": "^2.2.0",
  "@hookform/resolvers": "^3.9.1",
  "@stripe/react-stripe-js": "^2.8.1",
  "@stripe/stripe-js": "^4.8.0",
  "@tanstack/react-query": "^5.62.2",
  "@tanstack/react-table": "^8.20.5",
  "@uiw/react-md-editor": "^4.0.4",
  "axios": "^1.7.9",
  "clsx": "^2.1.1",
  "firebase": "^11.0.2",
  "lucide-react": "^0.460.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-hook-form": "^7.53.2",
  "react-hot-toast": "^2.4.1",
  "react-intersection-observer": "^9.13.1",
  "react-loading-skeleton": "^3.5.0",
  "react-router": "^7.0.2",
  "tailwind-merge": "^2.5.4",
  "yup": "^1.4.0"
}
```

### Server Dependencies
```json
{
  "express": "^4.21.1",
  "mongoose": "^8.8.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "firebase-admin": "^13.0.1",
  "stripe": "^17.3.1",
  "helmet": "^8.0.0",
  "morgan": "^1.10.0",
  "compression": "^1.7.5",
  "express-validator": "^7.2.0"
}
```

## 🛡 Security Features

- **Environment Variables**: All sensitive data secured with environment variables
- **Firebase Security**: Secure authentication with Firebase
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Security**: Security headers for Express.js
- **Image Upload Security**: Secure image handling with ImgBB

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Tablet Optimized**: Perfect experience on tablets
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: WCAG compliant design principles

## 🎨 Design Philosophy

- **User-Centric**: Intuitive and easy-to-use interface
- **Modern Aesthetics**: Clean, contemporary design
- **Consistent Branding**: Cohesive visual identity
- **Emotional Connection**: Warm, welcoming atmosphere
- **Performance Focused**: Fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Firebase project
- Stripe account
- ImgBB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pawshome.git
   cd pawshome
   ```

2. **Setup Backend**
   ```bash
   cd PawsHome_server
   npm install
   cp .env.example .env
   # Configure environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../PawsHome_client
   npm install
   cp .env.example .env
   # Configure environment variables
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_API_URL=http://localhost:5000/api
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and optimized images
- **Caching Strategy**: Intelligent caching with TanStack Query
- **Bundle Optimization**: Minimized bundle sizes
- **CDN Integration**: Fast content delivery

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Designer Name]
- **Project Manager**: [PM Name]

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- ImgBB for image hosting
- Unsplash for stock photos
- The open-source community

## 📞 Support

For support, email support@pawshome.com or join our Slack channel.

---

**Made with ❤️ for our furry friends**