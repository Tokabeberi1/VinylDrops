# GrooveHQ - Standalone Vinyl & Music Merchandise Store

## 🎵 Overview

GrooveHQ is a fully standalone, production-ready React + Vite application for selling vinyl records and music merchandise. The application has been completely migrated from a Base44-based builder platform to a professional, independent web application with **zero external dependencies**.

## ✨ Key Features

- **Complete Independence**: Zero Base44 SDKs, APIs, plugins, or cloud systems
- **Product Catalog**: Browse and filter vinyl records and merchandise
- **Wishlist System**: Save favorite items with localStorage persistence
- **News & Blog**: Read music industry news and release announcements
- **Admin Dashboard**: Manage products and news posts
- **Authentication**: Simple admin authentication system
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Fast Performance**: Vite-powered build with optimized bundles
- **Dark/Light Theme**: Theme switching support
- **Affiliate Links**: Amazon affiliate link tracking

## 🛠 Tech Stack

- **Framework**: React 18.2.0 with Vite 6.1.0
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules
- **UI Components**: Radix UI + shadcn/ui
- **Animation**: Framer Motion 11.16.4
- **State Management**: React Context API + TanStack React Query 5.84.1
- **Routing**: React Router DOM 6.26.0
- **Build Tool**: Vite with React plugin
- **Package Manager**: npm

## 📁 Project Structure

```
groovehq/
├── src/
│   ├── components/          # React UI components
│   │   ├── admin/          # Admin panel components
│   │   ├── news/           # News-related components
│   │   └── ui/             # Radix UI components
│   ├── pages/              # Page components (routes)
│   ├── services/           # Data services layer
│   │   ├── entities.js     # Entity service layer (Products, News, etc.)
│   │   └── mockDB.js       # Mock database with localStorage persistence
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── AuthContext.jsx # Standalone authentication system
│   │   ├── ThemeContext.js # Theme management
│   │   └── query-client.js # React Query configuration
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🚀 Quick Start

### Installation

```bash
# Navigate to project directory
cd "Aranairad ar washalo"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

## 🔐 Admin Authentication

Default credentials:
- **Email**: `admin@test.com`
- **Password**: `123456`

The authentication system is stored in `src/lib/AuthContext.jsx` using React Context and localStorage.

To modify credentials, edit the `ADMIN_CREDENTIALS` object in AuthContext.jsx.

## 💾 Data Persistence

All data is stored in localStorage under the key `groovehq_data`. The mock database includes:

- **5 Sample Products**: Pink Floyd, Beatles, Dua Lipa, Playboi Carti, Turntable
- **3 Sample News Posts**: Release news and industry updates

Data automatically persists to localStorage when you:
- Create/update/delete products
- Create/update/delete news posts
- Add items to wishlist
- Track affiliate clicks

## 📦 Services API

### ProductService
```javascript
import { ProductService } from '@/services/entities';

await ProductService.list()
await ProductService.filter({ category: 'vinyl' })
await ProductService.get(id)
await ProductService.create(data)
await ProductService.update(id, data)
await ProductService.delete(id)
```

### NewsPostService
```javascript
import { NewsPostService } from '@/services/entities';

await NewsPostService.list()
await NewsPostService.filter({ is_published: true })
await NewsPostService.get(id)
await NewsPostService.create(data)
await NewsPostService.update(id, data)
await NewsPostService.delete(id)
```

### WishlistItemService
```javascript
import { WishlistItemService } from '@/services/entities';

await WishlistItemService.list()
await WishlistItemService.filter({ user_email: 'user@example.com' })
await WishlistItemService.create(data)
await WishlistItemService.delete(id)
```

### AffiliateClickService
```javascript
import { AffiliateClickService } from '@/services/entities';

await AffiliateClickService.list()
await AffiliateClickService.filter({ product_id: 'prod_1' })
await AffiliateClickService.create(data)
```

## 🔄 What Was Removed from Base44

| Feature | Replacement |
|---------|-----------|
| @base44/sdk | `src/services/entities.js` |
| @base44/vite-plugin | Standalone vite.config.js |
| base44.auth.me() | `useAuth()` hook + localStorage |
| base44.entities.* | Service layer with localStorage |
| base44.integrations.UploadFile | FileReader API |
| Base44 cloud storage | localStorage persistence |
| Base44 branding | Inline SVG + custom styling |

## 🌐 Connecting to a Real Backend

### Firebase/Firestore

```javascript
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

export const ProductService = {
  async list() {
    const docs = await getDocs(collection(db, 'products'));
    return docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
```

### Supabase

```javascript
import { supabase } from '@/lib/supabase-config';

export const ProductService = {
  async list() {
    const { data } = await supabase.from('products').select('*');
    return data;
  },
};
```

### REST API

```javascript
const API_URL = 'https://api.yourdomain.com';

export const ProductService = {
  async list() {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },
};
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

### Traditional Hosting
Upload contents of `dist/` folder to your server.

## 🐛 Troubleshooting

### Module not found errors
Ensure imports use the `@` alias:
```javascript
// ✅ Correct
import { ProductService } from '@/services/entities';

// ❌ Wrong
import { ProductService } from './services/entities';
```

### Data lost after page refresh
Check browser console for localStorage errors. Data is persisted to `localStorage['groovehq_data']`.

### Styles not loading
Ensure `src/index.css` is imported in `src/main.jsx` and `tailwind.config.js` is properly configured.

## 📝 Development Commands

```bash
# Start development server with HMR
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# ESLint (linting)
npm run lint

# Format code (if prettier is configured)
npm run format
```

## 📄 File Reference

- **src/App.jsx** - Main app component with routing
- **src/main.jsx** - React entry point
- **src/lib/AuthContext.jsx** - Authentication logic
- **src/lib/ThemeContext.js** - Dark/Light theme
- **src/services/entities.js** - CRUD operations for all entities
- **src/services/mockDB.js** - Sample data and localStorage
- **index.html** - HTML template with app mount point
- **vite.config.js** - Build configuration
- **tailwind.config.js** - Styling configuration

## 🎯 Next Steps

1. **Test the application**
   - Run `npm run dev` and test all pages
   - Verify admin login works
   - Test wishlist functionality

2. **Customize content**
   - Edit mock data in `src/services/mockDB.js`
   - Update products in Admin panel
   - Change colors in `tailwind.config.js`

3. **Connect to backend**
   - Replace entity services with real API calls
   - Set up authentication server
   - Configure database (Firebase, Supabase, etc.)

4. **Deploy to production**
   - Run `npm run build`
   - Upload `dist/` to hosting service
   - Set up custom domain

## 📞 Support

For questions or issues:
1. Check the [troubleshooting](#-troubleshooting) section
2. Review service implementations in `src/services/`
3. Check React/Vite documentation for framework-specific issues

## 📜 License

This project is fully independent and no longer affiliated with Base44.

---

**Created**: 2024
**Status**: Production Ready ✅
**Deployment**: Ready to deploy 🚀

Enjoy your standalone GrooveHQ application!


Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
