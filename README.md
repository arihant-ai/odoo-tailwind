# Odoo 18 + Tailwind CSS Integration

A complete setup for integrating Tailwind CSS with Odoo 18 Community Edition, allowing you to use Tailwind utility classes alongside Bootstrap in your Odoo website projects.

## 🚀 Features

- **Odoo 18 Community Edition** - Latest version with Docker setup
- **Tailwind CSS 3.4+** - Full utility-first CSS framework
- **Bootstrap Compatibility** - Works alongside existing Bootstrap components
- **Multi-tenancy Support** - Configured for SAAS multi-tenant deployments
- **Development Tools** - Hot reload, watch mode, and development utilities
- **Custom Components** - Pre-built Odoo-specific Tailwind components
- **Website Editor Integration** - Tailwind classes available in website editor
- **Responsive Design** - Mobile-first responsive utilities
- **Performance Optimized** - Minified CSS with unused class purging

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- Git

## 🛠️ Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd odoo-tailwind
chmod +x setup.sh
```

### 2. Full Installation

```bash
./setup.sh install
```

This will:
- Install Node.js dependencies
- Build Tailwind CSS
- Start Docker containers (Odoo, PostgreSQL, Nginx)
- Test the installation

### 3. Access Odoo

- **Odoo Interface**: http://localhost:8069
- **Database Manager**: http://localhost:8069/web/database/manager

### 4. Install the Tailwind Module

1. Create a new database or use an existing one
2. Go to **Apps** menu
3. Search for "website_tailwind"
4. Install the **Website Tailwind CSS Integration** module
5. Visit `/tailwind-docs` to see the integration in action

## 📁 Project Structure

```
odoo-tailwind/
├── addons/
│   └── website_tailwind/          # Custom Tailwind integration addon
│       ├── __manifest__.py        # Addon manifest
│       ├── views/                 # XML templates and assets
│       ├── static/src/            # CSS, JS, and assets
│       └── data/                  # Demo data and pages
├── config/
│   └── odoo.conf                  # Odoo configuration
├── nginx/
│   └── nginx.conf                 # Nginx configuration for multi-tenancy
├── src/
│   └── input.css                  # Tailwind input file
├── docker-compose.yml             # Docker services configuration
├── package.json                   # Node.js dependencies
├── tailwind.config.js             # Tailwind configuration
└── setup.sh                       # Setup and management script
```

## 🎨 Using Tailwind CSS

### Basic Usage

Once the module is installed, you can use Tailwind classes in your website templates:

```html
<!-- Typography -->
<h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Odoo</h1>
<p class="text-lg text-gray-600 leading-relaxed">Your content here...</p>

<!-- Layout -->
<div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-2">Card Title</h3>
            <p class="text-gray-600">Card content...</p>
        </div>
    </div>
</div>

<!-- Buttons -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click Me
</button>
```

### Custom Components

The integration includes pre-built components:

```html
<!-- Odoo-style buttons -->
<button class="btn-odoo-primary">Primary Action</button>
<button class="btn-odoo-secondary">Secondary Action</button>

<!-- Cards -->
<div class="card-odoo">
    <div class="card-odoo-header">
        <h3>Card Header</h3>
    </div>
    <div class="card-odoo-body">
        <p>Card content goes here</p>
    </div>
</div>

<!-- Alerts -->
<div class="alert-odoo-info">
    <p>This is an info alert</p>
</div>
```

### Responsive Design

```html
<!-- Mobile-first responsive design -->
<div class="text-sm md:text-base lg:text-lg">
    Responsive text
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Responsive grid -->
</div>
```

## 🔧 Development

### Available Commands

```bash
# Full installation
./setup.sh install

# Start/stop containers
./setup.sh start
./setup.sh stop
./setup.sh restart

# Development mode (watch for changes)
./setup.sh watch

# Build Tailwind CSS
./setup.sh build

# View logs
./setup.sh logs odoo
./setup.sh logs db
./setup.sh logs nginx

# Check status
./setup.sh status

# Test installation
./setup.sh test
```

### Development Workflow

1. **Start development mode**:
   ```bash
   ./setup.sh watch
   ```

2. **Edit Tailwind styles** in `src/input.css`

3. **Modify templates** in `addons/website_tailwind/`

4. **Changes are automatically compiled** and available in Odoo

### Customizing Tailwind

Edit `tailwind.config.js` to customize:

- **Colors**: Add your brand colors
- **Fonts**: Configure custom fonts
- **Spacing**: Add custom spacing values
- **Breakpoints**: Modify responsive breakpoints
- **Components**: Add custom component classes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#your-color',
        'brand-secondary': '#your-color',
      },
      fontFamily: {
        'custom': ['Your Font', 'sans-serif'],
      },
    },
  },
}
```

## 🌐 Multi-Tenancy Configuration

This setup is configured for SAAS multi-tenancy:

### Database Configuration

- **Database Filter**: `^%d$` (matches subdomain to database name)
- **Example**: `test110.arihantai.com` → `test110` database

### Nginx Configuration

- Configured for subdomain routing
- SSL-ready (certificates in `nginx/ssl/`)
- Rate limiting and security headers

### Adding New Tenants

1. Create database: `test110`
2. Configure DNS: `test110.arihantai.com` → your server
3. Install required modules
4. Database is automatically selected based on subdomain

## 📦 Docker Services

### Services Overview

- **odoo**: Odoo 18 Community Edition
- **db**: PostgreSQL 15 database
- **nginx**: Nginx reverse proxy with multi-tenancy
- **node**: Node.js for Tailwind CSS compilation

### Environment Variables

Configure in `docker-compose.yml`:

```yaml
environment:
  - HOST=db
  - USER=odoo
  - PASSWORD=odoo
  - ODOO_RC=/etc/odoo/odoo.conf
```

### Volumes

- `odoo-web-data`: Odoo filestore and sessions
- `odoo-db-data`: PostgreSQL data
- `./addons`: Custom addons (including Tailwind)
- `./config`: Odoo configuration files

## 🎯 Production Deployment

### Security Checklist

- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up proper firewall rules
- [ ] Configure backup strategy
- [ ] Enable log rotation
- [ ] Set resource limits

### Performance Optimization

1. **Odoo Configuration**:
   ```ini
   workers = 4
   max_cron_threads = 2
   limit_memory_hard = 2684354560
   ```

2. **Database Optimization**:
   - Configure PostgreSQL for production
   - Set up database backups
   - Monitor query performance

3. **Nginx Optimization**:
   - Enable gzip compression
   - Configure caching headers
   - Set up rate limiting

## 🐛 Troubleshooting

### Common Issues

**Odoo not starting**:
```bash
./setup.sh logs odoo
# Check for database connection issues
```

**Tailwind CSS not loading**:
```bash
./setup.sh build
# Rebuild Tailwind CSS
```

**Permission issues**:
```bash
sudo chown -R $USER:$USER .
# Fix file permissions
```

**Database connection failed**:
```bash
./setup.sh logs db
# Check PostgreSQL logs
```

### Reset Everything

```bash
./setup.sh stop
docker-compose down -v
docker system prune -f
./setup.sh install
```

## 📚 Documentation

### Tailwind CSS Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)

### Odoo Resources

- [Odoo 18 Documentation](https://www.odoo.com/documentation/18.0/)
- [Odoo Developer Documentation](https://www.odoo.com/documentation/18.0/developer.html)
- [Website Builder Guide](https://www.odoo.com/documentation/18.0/applications/websites.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Odoo Community for the amazing ERP platform
- Tailwind CSS team for the utility-first CSS framework
- Docker community for containerization tools

---

**Happy coding with Odoo + Tailwind CSS! 🎉**
