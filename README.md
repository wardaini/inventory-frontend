# Inventory Management System - Frontend

## 🚀 Live Demo

**Application:** https://inventory-frontend-tm8n.vercel.app

**Test Credentials:**
- Email: demo@example.com
- Password: demo123456
- Role: Admin

## ✨ Features

### User Management
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Profile Management
- ✅ Change Password
- ✅ Role-Based UI (Admin, Staff, Viewer)

### Inventory Management
- ✅ Product CRUD Operations
- ✅ Search & Filter Products
- ✅ Sort by Multiple Fields
- ✅ Pagination
- ✅ Low Stock Alerts
- ✅ Dashboard Statistics
- ✅ Real-time Data

### Security
- ✅ HTTPS Encryption
- ✅ JWT Token Management
- ✅ Role-Based Access Control
- ✅ XSS Protection
- ✅ CSRF Protection (SameSite cookies)
- ✅ Secure Session Management

### UI/UX
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Dark Mode Support (optional)
- ✅ Loading States
- ✅ Error Handling
- ✅ Toast Notifications

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📦 Installation

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Local Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/inventory-frontend.git
cd inventory-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env

# Start development server
npm run dev
```

Application akan berjalan di `http://localhost:5173`

## ⚙️ Environment Variables

Create `.env` file:
```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production (di Vercel)
VITE_API_URL=https://inventory-backend-sis8.onrender.com/api
```

## 📱 Pages & Routes

| Route | Page | Description | Auth Required |
|-------|------|-------------|---------------|
| `/` | Redirect | Redirect to dashboard | - |
| `/login` | Login | User login | No |
| `/register` | Register | User registration | No |
| `/dashboard` | Dashboard | Statistics & overview | Yes |
| `/products` | Products | Product list with filters | Yes |
| `/products/create` | Create Product | Add new product | Yes (Admin/Staff) |
| `/products/edit/:id` | Edit Product | Update product | Yes (Admin/Staff) |
| `/products/:id` | Product Detail | View product details | Yes |
| `/products/low-stock` | Low Stock | Products need restocking | Yes |
| `/profile` | Profile | User profile settings | Yes |

## 🎨 UI Components

### Layout Components
- `Navbar` - Top navigation with user menu
- `Sidebar` - Side navigation with menu items
- `Layout` - Main layout wrapper

### Common Components
- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Modal` - Dialog/modal component
- `LoadingSpinner` - Loading indicator
- `ConfirmDialog` - Confirmation dialog

### Feature Components
- `ProductCard` - Product display card
- `ProductForm` - Create/Edit product form
- `ProductFilter` - Search & filter UI
- `StatsCard` - Dashboard statistics card
- `RecentProducts` - Recent products list

## 🔒 Security Implementation

### Frontend Security
1. **JWT Token Management**
   - Stored in localStorage
   - Auto-included in API requests
   - Auto-removed on logout/401

2. **Route Protection**
   - Private routes require authentication
   - Role-based route access
   - Auto-redirect unauthenticated users

3. **XSS Prevention**
   - React default escaping
   - Input sanitization
   - Content Security Policy headers

4. **API Security**
   - HTTPS only
   - CORS validation
   - Token expiry handling

## 🚀 Deployment

### Deploy to Vercel

1. **Push code to GitHub**

2. **Connect Vercel:**
   - Login to https://vercel.com
   - Import Git Repository
   - Select `inventory-frontend`

3. **Configure Build:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables:**
```
   VITE_API_URL=https://inventory-backend-sis8.onrender.com/api
```

5. **Deploy!**

Frontend akan auto-deploy setiap push ke GitHub.

### Build for Production
```bash
# Build
npm run build

# Preview build locally
npm run preview
```

## 📁 Project Structure
```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   ├── layout/      # Layout components
│   │   ├── products/    # Product components
│   │   └── dashboard/   # Dashboard components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── productService.js
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── utils/           # Utility functions
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🧪 Testing

### Manual Testing
1. Register new user
2. Login
3. Create product
4. Edit product
5. Delete product (admin only)
6. Test filters & search
7. Check low stock alerts
8. Update profile
9. Change password
10. Logout

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📊 Performance

- Lighthouse Score: 90+
- First Contentful Paint: <2s
- Time to Interactive: <3s
- Bundle Size: ~500KB
- CDN: Vercel Global CDN

## 🐛 Troubleshooting

### Registration Failed
- Check browser console (F12)
- Verify backend is running
- Check CORS configuration
- Clear browser cache (Ctrl+Shift+R)

### Products Not Loading
- Check Network tab (F12)
- Verify JWT token in localStorage
- Check backend API response
- Verify VITE_API_URL is correct

### Deployment Issues
- Verify environment variables in Vercel
- Check build logs
- Ensure backend URL is correct (https://, not http://)

## 🔄 Update & Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Update Frontend
```bash
# Edit code locally
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys
```

## 📱 Responsive Design

- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

All components fully responsive.

## 📄 License

MIT

## 👨‍💻 Author

Wardatul A'ani - [GitHub Profile](https://github.com/wardaini)

## 🔗 Links

- **Frontend App:** https://inventory-frontend-tm8n.vercel.app
- **Backend API:** https://inventory-backend-sis8.onrender.com
- **GitHub Frontend:** https://github.com/wardaini/inventory-frontend
- **GitHub Backend:** https://github.com/wardaini/inventory-backend
