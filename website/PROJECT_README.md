# Design Concept - Business Promotion Website

A modern, full-stack business promotion website for a commercial designing and printing shop named "Design Concept".

## 🌟 Features

### Frontend
- **Modern Responsive UI** - Mobile and desktop optimized
- **Multi-language Support** - English, Hindi (हिन्दी), Marathi (मराठी)
- **Product Showcase** - Display services with images and descriptions
- **Product Customization** - Size, material, quantity selection
- **Enquiry System** - Request quote with file upload
- **WhatsApp Integration** - Auto-send enquiry to WhatsApp

### Backend
- **Next.js API Routes** - RESTful API for products and enquiries
- **MongoDB Database** - Store products and enquiries
- **Cloudinary Integration** - Secure file upload and storage
- **Admin Dashboard** - Manage products and view enquiries

## 📁 Project Structure

```
website/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── (main)/         # Main layout group
│   │   │   ├── home/       # Home page
│   │   │   ├── services/   # Services listing
│   │   │   ├── products/   # Product details
│   │   │   ├── about/      # About us
│   │   │   ├── contact/    # Contact us
│   │   │   ├── enquiry/    # Enquiry form
│   │   │   └── admin/      # Admin dashboard
│   │   └── layout.tsx      # Locale layout
│   └── api/                # API routes
│       ├── products/       # Products API
│       ├── enquiries/      # Enquiries API
│       └── upload/         # File upload API
├── components/             # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                    # Utilities
│   ├── db.ts              # MongoDB connection
│   └── cloudinary.ts      # Cloudinary config
├── models/                 # MongoDB models
│   ├── Product.ts
│   └── Enquiry.ts
├── messages/               # i18n translations
│   ├── en.json
│   ├── hi.json
│   └── mr.json
├── scripts/
│   └── seed.ts            # Database seeder
└── i18n.ts                # i18n configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI="your-mongodb-connection-string"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_SECRET="your-cloudinary-secret"
   WHATSAPP_NUMBER="919876543210"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

3. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/[locale]/home` | Hero section, featured services, why choose us |
| Services | `/[locale]/services` | Filterable services listing |
| Product Details | `/[locale]/products/[id]` | Product info with customization |
| About Us | `/[locale]/about` | Company info, mission, vision |
| Contact | `/[locale]/contact` | Contact info, FAQ |
| Enquiry | `/[locale]/request-quote` | Quote request form |
| Admin | `/[locale]/admin` | Dashboard for managing products & enquiries |

## 🌐 Languages

- **English** (`/en/...`)
- **Hindi** (`/hi/...`)
- **Marathi** (`/mr/...`)

Language can be changed using the language selector in the header.

## 🛠️ Services Categories

- Personal Designs
- Acrylic Name Plates
- LED Signages
- Standees
- All Types of Stickers
- Large Hoardings
- Banners (Branchers)

## 🔧 Admin Dashboard

Access the admin dashboard at `/[locale]/admin`:

### Features
- **View Enquiries** - See all customer enquiries
- **Update Status** - Mark enquiries as pending/contacted/completed
- **Download Files** - Download customer uploaded design files
- **Manage Products** - Add, edit, delete products
- **Multi-language Products** - Add product names/descriptions in all languages

## 📤 File Upload

- Accepts PDF files only
- Maximum file size: 10MB
- Files stored on Cloudinary
- URLs saved in MongoDB

## 💬 WhatsApp Integration

When a customer submits an enquiry:
1. Data is saved to MongoDB
2. Formatted message is sent to owner's WhatsApp
3. Customer is redirected to WhatsApp with pre-filled message

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `WHATSAPP_NUMBER` | Owner's WhatsApp number (with country code) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for WhatsApp redirects |

## 📦 Build & Deploy

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linting
```bash
npm run lint
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **File Storage**: Cloudinary
- **i18n**: next-intl
- **Icons**: Lucide React
- **File Upload**: react-dropzone
- **Validation**: Built-in form validation

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Enquiries
- `GET /api/enquiries` - Get all enquiries (admin)
- `GET /api/enquiries/[id]` - Get single enquiry (admin)
- `POST /api/enquiries` - Create enquiry
- `PUT /api/enquiries/[id]` - Update enquiry status (admin)
- `DELETE /api/enquiries/[id]` - Delete enquiry (admin)

### Upload
- `POST /api/upload` - Upload file to Cloudinary

## 🎨 Design Features

- Clean, modern UI similar to Vistaprint
- Smooth animations and transitions
- Professional color scheme (blue/purple gradient)
- Responsive design for all screen sizes
- Accessible forms with validation
- Loading states and error handling

## 📞 Support

For any issues or questions, please contact:
- Email: info@designconcept.com
- Phone: +91 98765 43210

## 📄 License

This project is proprietary and confidential.

---

Built with ❤️ for Design Concept
