# Lubomir Polascin - Professional Portfolio Website

A modern, responsive portfolio website showcasing expertise in nephrology, web development, translation, and IT consulting.

## 🚀 Features

### Technical Features
- ✅ **Semantic HTML5** with ARIA labels for accessibility
- ✅ **Modern CSS** with CSS Variables and Grid/Flexbox layouts
- ✅ **Dark Mode** - Auto-detect system preference + manual toggle
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Intersection Observer** for smooth fade-in animations
- ✅ **Form Validation** with real-time feedback
- ✅ **AJAX Form Submission** via PHP backend
- ✅ **SEO Optimized** with Open Graph and Twitter Card meta tags
- ✅ **Performance Optimized** with preloading and resource hints
- ✅ **Security Headers** including CSP
- ✅ **PWA Ready** with Service Worker and Web App Manifest
- ✅ **Toast Notifications** for better user feedback
- ✅ **Scroll Progress Indicator** for navigation
- ✅ **Particle Effects** for visual enhancement
- ✅ **Animated Statistics** with counter animations
- ✅ **Enhanced Mobile Menu** with overlay
- ✅ **Back to Top Button** with smooth scrolling
- ✅ **Sticky Header** with blur effect
- ✅ **Parallax Scrolling** effects
- ✅ **Enhanced Footer** with organized sections

### Content Sections
1. **Hero** - Professional introduction highlighting multi-disciplinary expertise
2. **Expertise** - Three key areas: Medical Practice, Development, Translation
3. **About** - Personal story and skill tags
4. **Stats** - Animated statistics with counter effects
5. **Skills** - Technical skills with animated progress bars
6. **Portfolio** - Featured projects across medicine, tech, and linguistics
7. **Products** - Digital products and guides
8. **Education** - Nephrology education resources
9. **Testimonials** - Client and colleague feedback
10. **Contact** - Functional contact form with enhanced validation
11. **CTA** - Call-to-action section for engagement

## 📁 File Structure

```
/srv/http/polascinweb/
├── index.php              # Main HTML page with PHP
├── style.css              # Enhanced styles with animations
├── main.js                # Interactive functionality
├── sw.js                  # Service Worker for PWA
├── contact-handler.php    # Form submission backend
├── manifest.json          # PWA manifest
├── og-image.jpg          # Social media preview image
├── profile_photo.jpg      # Profile image
├── header_logo.jpg        # Header logo
├── .htaccess             # Server configuration
├── robots.txt            # Search engine crawling rules
├── sitemap.xml           # XML sitemap for SEO
├── affiliate.en.php      # Affiliate page
└── Various image assets
```

## 🎨 Design Features

- **Color Scheme**: Blue-purple gradient with HSL variables
- **Typography**: Inter font from Google Fonts
- **Animations**: Fade-in effects, hover states, smooth scrolling, particle effects
- **Accessibility**: Skip-to-content, focus states, semantic markup, ARIA labels
- **Dark Mode**: Automatic OS detection + manual toggle with localStorage
- **Mobile Experience**: Responsive design with enhanced mobile menu
- **Performance**: Optimized loading, caching, and progressive enhancement

## 🛠️ Setup & Usage

### Local Development Server

The development server is already running at:
```
http://localhost:8000
```

To start it manually:
```bash
cd /srv/http/polascinweb
php -S localhost:8000
```

### Contact Form Configuration

Edit `contact-handler.php` to configure email settings:
```php
define('ADMIN_EMAIL', 'your-email@example.com');
```

### Analytics Setup

Replace `GA_MEASUREMENT_ID` in `index.php` with your Google Analytics ID.

### Customization

**Colors**: Edit CSS variables in `style.css`:
```css
:root {
    --hue-primary: 220;     /* Blue */
    --hue-secondary: 280;   /* Purple */
}
```

**Content**: Edit sections directly in `index.php`

**Favicon**: Replace the emoji in the data URI or link to a real file

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 8.x
- **Fonts**: Google Fonts (Inter)
- **Icons**: Emoji (no external dependencies)
- **PWA**: Service Worker API, Web App Manifest
- **Analytics**: Google Analytics (optional)

## 📊 Performance

- Minimal dependencies (no frameworks)
- Optimized images with lazy loading
- Preloaded critical resources
- Efficient animations using Intersection Observer
- Debounced scroll events
- Service Worker caching for offline functionality
- Progressive enhancement for better compatibility

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## 🔒 Security Features

- Content Security Policy (CSP)
- Security headers via .htaccess
- Input sanitization and validation
- HTTPS enforcement (when configured)

## 📱 PWA Features

- Installable web app
- Offline functionality
- Fast loading with caching
- Native app-like experience

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Screen reader friendly
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences respected

## 📈 SEO Features

- Structured data (Schema.org)
- Open Graph meta tags
- Twitter Card support
- XML sitemap
- Robots.txt configuration
- Semantic HTML structure
- Fast loading times

## 🎯 Recent Improvements

- **Service Worker**: Offline functionality and caching
- **Toast Notifications**: Better user feedback system
- **Scroll Progress**: Visual navigation indicator
- **Particle Effects**: Enhanced visual appeal
- **Enhanced Footer**: Better organization and links
- **Improved Analytics**: Google Analytics integration
- **Better Security**: Enhanced CSP and headers
- **Mobile Optimizations**: Improved mobile experience
- **Performance**: Better loading and caching strategies

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 Notes

- Contact form logs submissions to `contact-log.txt`
- Email functionality requires proper PHP mail configuration
- Dark mode preference saved in localStorage
- All animations respect `prefers-reduced-motion`

## 🔒 Security

- Content Security Policy headers
- Input sanitization in contact form
- XSS protection via htmlspecialchars
- CSRF protection recommended for production

## 📱 Responsive Breakpoints

- Desktop: >768px
- Tablet: 481-768px  
- Mobile: ≤480px

## 🎯 SEO

- Comprehensive meta tags
- Open Graph image (1200x630px)
- Semantic HTML structure
- Optimized title and descriptions
- XML sitemap recommended for production

## 📄 License

Personal portfolio website - All rights reserved © 2026 Lubomir Polascin

---

**Created**: January 2026  
**Author**: Lubomir Polascin  
**Version**: 1.0.0
