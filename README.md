# Vue Monitoring Service

Dashboard monitoring real-time untuk aplikasi dengan fitur log tracking, trace monitoring, dan violations management.

![Vue](https://img.shields.io/badge/Vue-3.5.22-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Prerequisites](#-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Struktur Project](#-struktur-project)
- [Flow Aplikasi](#-flow-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Build untuk Production](#-build-untuk-production)
- [Screenshots](#-screenshots)

## ✨ Fitur Utama

### 📊 Dashboard Overview
- Statistik real-time (total logs, violations, errors)
- Grafik pertumbuhan data dengan Chart.js
- Auto-refresh setiap interval tertentu
- Summary cards dengan informasi penting

### 🔍 Monitoring & Logs
- **Log Monitoring**: View dan filter logs berdasarkan app name dan level
- **Trace Monitoring**: Tracking correlation ID untuk debugging
- **Violations Monitoring**: 
  - Violations by App
  - Violations by Message
- Real-time data refresh dan pagination

### ⚙️ Rules Management
- **App Rules**: Kelola aturan monitoring per aplikasi
- **Message Rules**: Kelola aturan monitoring per pesan
- CRUD operations lengkap (Create, Read, Update, Delete)

### 🎨 UI/UX Features
- Responsive design dengan mobile-first approach
- Dark/Light theme toggle dengan auto-detect OS preference
- Collapsible sidebar navigation
- Modern UI dengan Argon Dashboard theme
- FontAwesome icons

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Vue 3** | 3.5.22 | Framework JavaScript dengan Composition API |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 7.1.7 | Build tool dan dev server |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **Vue Router** | 4.5.1 | Router untuk SPA |
| **Axios** | 1.12.2 | HTTP client untuk API calls |
| **Chart.js** | 4.5.1 | Library untuk data visualization |
| **FontAwesome** | 7.1.0 | Icon library |

## 📋 Prerequisites

Pastikan sistem Anda memiliki:
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 atau **yarn** >= 1.22.0
- Backend API yang berjalan di `localhost:9501`

## 🚀 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd vue-monitoring-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   # Buat file .env.local (opsional)
   echo "VITE_API_BASE_URL=http://localhost:9501" > .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Buka browser**
   ```
   http://localhost:5173
   ```

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env.local` di root project:

```env
# API Base URL (opsional, default: proxy ke /api)
VITE_API_BASE_URL=http://localhost:9501
```

### Vite Configuration

File `vite.config.ts` sudah dikonfigurasi dengan proxy untuk API:

```typescript
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9501',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Tailwind Configuration

File `tailwind.config.js` menggunakan Argon Dashboard theme dengan custom colors:

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#5e72e4',
          600: '#4f46e5'
        }
      }
    }
  }
}
```

## 📁 Struktur Project

```
src/
├── components/           # Reusable components
│   ├── Navbar.vue       # Top navigation bar
│   ├── Sidebar.vue      # Side navigation
│   ├── SidebarItem.vue  # Sidebar menu item
│   └── SidebarDropdown.vue # Dropdown menu
├── views/               # Page components
│   ├── Dashboard.vue   # Dashboard overview
│   ├── Monitoring.vue  # Log monitoring
│   ├── Trace.vue       # Trace monitoring
│   ├── AppRules.vue    # App rules management
│   ├── MessageRules.vue # Message rules management
│   ├── ViolationsByApp.vue # Violations by app
│   └── ViolationsByMessage.vue # Violations by message
├── services/            # API services
│   └── api.js          # API client dan endpoints
├── router/              # Vue Router configuration
│   └── index.js         # Route definitions
├── assets/              # Static assets
│   ├── css/            # Stylesheets
│   ├── fonts/          # Custom fonts
│   ├── img/            # Images
│   └── js/             # JavaScript libraries
├── App.vue             # Root component
├── main.ts             # Application entry point
└── styles.css          # Global styles
```

## 🔄 Flow Aplikasi

### 1. Authentication & Initialization
```
App Start → Load Theme Preference → Initialize Router → Mount App
```

### 2. Dashboard Flow
```
Dashboard Load → Fetch Overview Data → Display Stats → Auto Refresh
```

### 3. Monitoring Flow
```
Select Filters → API Call → Display Logs → Pagination → Real-time Updates
```

### 4. Rules Management Flow
```
Load Rules → Display List → CRUD Operations → API Sync → UI Update
```

### 5. Theme Management Flow
```
App Load → Check localStorage → Apply Theme → Listen OS Changes → Toggle Theme
```

## 🔌 API Endpoints

### Dashboard
- `GET /dashboard/overview` - Get dashboard statistics

### Monitoring
- `GET /monitor/server` - Get logs dengan pagination
- `GET /monitor/trace?correlation_id={id}` - Get trace data
- `GET /monitor/violation/by-app` - Get violations by app
- `GET /monitor/violation/by-message` - Get violations by message

### App Rules
- `GET /rules/app` - Get all app rules
- `POST /rules/app` - Create new app rule
- `PUT /rules/app/{id}` - Update app rule
- `DELETE /rules/app/{id}` - Delete app rule

### Message Rules
- `GET /rules/message` - Get all message rules
- `POST /rules/message` - Create new message rule
- `PUT /rules/message/{id}` - Update message rule
- `DELETE /rules/message/{id}` - Delete message rule

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Development Guidelines

1. **Component Structure**: Gunakan Composition API dengan `<script setup>`
2. **Styling**: Gunakan Tailwind CSS classes, hindari custom CSS
3. **API Calls**: Gunakan functions dari `services/api.js`
4. **TypeScript**: Gunakan type annotations untuk props dan data
5. **Responsive**: Test di berbagai ukuran layar

### Code Style

- Gunakan ESLint dan Prettier untuk konsistensi
- Follow Vue 3 Composition API best practices
- Gunakan TypeScript untuk type safety
- Comment kode yang kompleks

## 🏗️ Build untuk Production

1. **Build aplikasi**
   ```bash
   npm run build
   ```

2. **Preview build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - Upload folder `dist/` ke web server
   - Pastikan backend API accessible
   - Configure environment variables jika diperlukan

## 📸 Screenshots

### Dashboard Overview
![Dashboard](src/assets/img/screenshots/dashboard.png)

### Monitoring Logs
![Monitoring](src/assets/img/screenshots/monitoring.png)

### Trace Monitoring
![Trace](src/assets/img/screenshots/trace.png)

### Rules Management
![Rules](src/assets/img/screenshots/rules.png)

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan Vue 3 + TypeScript + Tailwind CSS**