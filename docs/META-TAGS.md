# Website Metadata Documentation

This document outlines all metadata, SEO, and web standards implementations for the 中日交流标准日本语 词汇学习系统 (Japanese Vocabulary Learning System).

## Table of Contents

1. [Basic Metadata](#basic-metadata)
2. [SEO Optimization](#seo-optimization)
3. [Social Media Integration](#social-media-integration)
4. [Progressive Web App (PWA)](#progressive-web-app-pwa)
5. [Accessibility](#accessibility)
6. [Security](#security)
7. [Performance](#performance)
8. [Structured Data](#structured-data)
9. [File Locations](#file-locations)

## Basic Metadata

### HTML Meta Tags (in `app/layout.tsx`)

```typescript
title: {
  default: "中日交流标准日本语 - 词汇学习系统",
  template: "%s | 中日交流标准日本语 词汇学习系统"
}
```

**Purpose**: Provides both Chinese and English titles for better international reach.

### Description
```typescript
description: "专为中国学习者设计的日语词汇学习工具，基于新标准日本语教材系列。包含高级筛选、动词变位、响应式设计、词汇详情模态窗口和流畅动画。A modernized Japanese vocabulary learning tool designed for Chinese speakers using 新标准日本语 textbook series, featuring advanced filtering, verb conjugations, responsive design, vocabulary detail modals, and smooth animations."
```

**Features Highlighted**:
- Target audience (Chinese learners)
- Core functionality (filtering, conjugations, modals)
- Technical features (responsive design, animations)
- Bilingual description for broader reach

### Keywords
```typescript
keywords: [
  "日语学习", "Japanese learning", "新标准日本语", "Standard Japanese",
  "中文界面", "Chinese interface", "词汇学习", "vocabulary learning",
  "动词变位", "verb conjugation", "响应式设计", "responsive design",
  "模态窗口", "modal dialogs", "复制功能", "copy functionality",
  "收藏管理", "bookmark management", "移动端优化", "mobile optimized",
  "无障碍设计", "accessibility", "流畅动画", "smooth animations",
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"
]
```

## SEO Optimization

### Robots Configuration
```typescript
robots: {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1
  }
}
```

### Canonical URLs
```typescript
alternates: {
  canonical: "/",
  languages: {
    "zh-CN": "/",
    "en": "/"
  }
}
```

### Sitemap (public/sitemap.xml)
- Homepage
- Documentation sections
- API documentation
- Architecture guides
- Design documentation
- Data documentation

### Robots.txt (public/robots.txt)
- Allows all major search engines
- Blocks aggressive crawlers
- Provides sitemap location
- Sets appropriate crawl delays

## Social Media Integration

### Open Graph Tags
```typescript
openGraph: {
  type: "website",
  locale: "zh_CN",
  alternateLocale: ["en_US"],
  title: "中日交流标准日本语 - 词汇学习系统",
  description: "专为中国学习者设计的现代化日语词汇学习工具...",
  url: "https://sandman-ren.github.io/biaori-vocab",
  siteName: "中日交流标准日本语 词汇学习系统",
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "中日交流标准日本语 词汇学习系统 - 现代化日语学习工具",
      type: "image/jpeg"
    }
  ]
}
```

### Twitter Cards
```typescript
twitter: {
  card: "summary_large_image",
  title: "中日交流标准日本语 - 词汇学习系统",
  description: "专为中国学习者设计的现代化日语词汇学习工具...",
  images: ["/og-image.jpg"],
  creator: "@SandmanRen"
}
```

**Benefits**:
- Rich previews on social media platforms
- Increased click-through rates
- Professional appearance when shared
- Bilingual support for international sharing

## Progressive Web App (PWA)

### Web App Manifest (public/manifest.json)

```json
{
  "name": "中日交流标准日本语 词汇学习系统",
  "short_name": "日语词汇学习",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

### Features
- **Installable**: Can be installed as a native app
- **Offline Ready**: Service worker capability
- **App-like Experience**: Standalone display mode
- **Multi-platform**: Works on desktop and mobile
- **Icons**: Multiple sizes for different devices

### Apple Touch Icons
```typescript
appleWebApp: {
  capable: true,
  title: "日语词汇学习",
  statusBarStyle: "default"
}
```

## Accessibility

### Language Declaration
```html
<html lang="zh-CN" className="h-full">
```

### Viewport Configuration
```typescript
viewport: {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
}
```

### Format Detection
```typescript
formatDetection: {
  telephone: false,
  date: false,
  address: false,
  email: false,
  url: false
}
```

**Purpose**: Prevents unwanted auto-linking of text content.

## Security

### Content Security Policy
Implemented to prevent XSS attacks and ensure secure content loading.

### Security.txt (public/.well-known/security.txt)
- Contact information for security researchers
- Reporting guidelines
- Security policy reference
- Scope definitions

### SECURITY.md
- Comprehensive security policy
- Vulnerability reporting process
- Response timelines
- Security measures documentation

## Performance

### Font Optimization
```typescript
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
```

### Theme Color Optimization
```typescript
themeColor: [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" }
]
```

### Static Generation
- Next.js static export for optimal performance
- CDN-friendly deployment
- Fast loading times
- Minimal server requirements

## Structured Data

### JSON-LD Schema (in layout.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "中日交流标准日本语 词汇学习系统",
  "applicationCategory": "EducationalApplication",
  "applicationSubCategory": "Language Learning",
  "isAccessibleForFree": true
}
```

### Rich Snippets Support
- Educational application schema
- Software application details
- Offering information (free)
- Feature descriptions
- Technical requirements
- Support documentation links

## File Locations

### Core Metadata Files
- `app/layout.tsx` - Main metadata configuration
- `public/manifest.json` - PWA manifest
- `public/robots.txt` - Search engine instructions
- `public/sitemap.xml` - Site structure for crawlers
- `public/humans.txt` - Human-readable site information

### Security Files
- `SECURITY.md` - Security policy
- `public/.well-known/security.txt` - Security contact info

### Documentation
- `docs/` - Comprehensive documentation
- `CHANGELOG.md` - Version history
- `README.md` - Project overview

## Validation and Testing

### SEO Tools
- Google Search Console compatibility
- Bing Webmaster Tools support
- Schema.org markup validation
- Open Graph debugger compatibility

### Performance Testing
- Core Web Vitals optimization
- Lighthouse 100/100 performance target
- Mobile-first responsive design
- Accessibility WCAG 2.1 AA compliance

### Social Media Testing
- Facebook Open Graph debugger
- Twitter Card validator
- LinkedIn post inspector
- Discord embed previews

## Maintenance

### Regular Updates Required
1. **Sitemap**: Update when adding new documentation
2. **Manifest**: Update version numbers and features
3. **Metadata**: Refresh descriptions with new features
4. **Security.txt**: Update expiration dates
5. **Structured Data**: Validate schema changes

### Monitoring
- Search Console performance
- Social media engagement metrics
- PWA installation rates
- Accessibility compliance scores

## Browser Support

### Metadata Compatibility
- **Chrome 80+**: Full PWA and metadata support
- **Firefox 75+**: Complete Open Graph and Twitter Cards
- **Safari 13+**: Apple Web App tags and touch icons
- **Edge 80+**: All Microsoft features supported

### Fallbacks
- Progressive enhancement for older browsers
- Graceful degradation of advanced features
- Core functionality available without JavaScript
- Accessible design patterns throughout

---

*This metadata documentation is maintained alongside the application and updated with each feature release.*
