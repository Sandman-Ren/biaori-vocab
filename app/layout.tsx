import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "中日交流标准日本语 - 词汇学习系统",
    template: "%s | 中日交流标准日本语 词汇学习系统"
  },
  description: "专为中国学习者设计的日语词汇学习工具，基于新标准日本语教材系列。包含高级筛选、动词变位、响应式设计、词汇详情模态窗口和流畅动画。支持移动端优化、复制功能、收藏管理和PDF导出。A modernized Japanese vocabulary learning tool designed for Chinese speakers using 新标准日本语 textbook series, featuring advanced filtering, verb conjugations, responsive design, vocabulary detail modals, and smooth animations.",
  keywords: [
    "日语学习", "Japanese learning", "新标准日本语", "Standard Japanese",
    "中文界面", "Chinese interface", "词汇学习", "vocabulary learning",
    "动词变位", "verb conjugation", "响应式设计", "responsive design",
    "模态窗口", "modal dialogs", "复制功能", "copy functionality",
    "收藏管理", "bookmark management", "移动端优化", "mobile optimized",
    "无障碍设计", "accessibility", "流畅动画", "smooth animations",
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"
  ],
  authors: [
    {
      name: "Sandman-Ren",
      url: "https://github.com/Sandman-Ren"
    }
  ],
  creator: "Sandman-Ren",
  publisher: "Sandman-Ren",
  category: "Education",
  classification: "Language Learning",
  applicationName: "中日交流标准日本语 词汇学习系统",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "日语词汇学习",
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  metadataBase: new URL("https://sandman-ren.github.io/biaori-vocab"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      "en": "/"
    }
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    title: "中日交流标准日本语 - 词汇学习系统",
    description: "专为中国学习者设计的现代化日语词汇学习工具。包含高级筛选、动词变位、响应式设计、词汇详情模态窗口和流畅动画。基于新标准日本语教材系列。",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "中日交流标准日本语 - 词汇学习系统",
    description: "专为中国学习者设计的现代化日语词汇学习工具。高级筛选、动词变位、响应式设计、模态窗口。",
    images: ["/og-image.jpg"],
    creator: "@SandmanRen"
  },
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
  },
  verification: {
    google: "your-google-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code"
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  colorScheme: "light dark"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "中日交流标准日本语 词汇学习系统",
    "alternateName": "Japanese Vocabulary Learning System for Chinese Speakers",
    "description": "专为中国学习者设计的现代化日语词汇学习工具，基于新标准日本语教材系列。包含高级筛选、动词变位、响应式设计、词汇详情模态窗口和流畅动画。",
    "url": "https://sandman-ren.github.io/biaori-vocab",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "Language Learning",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Works with Chrome 80+, Firefox 75+, Safari 13+, Edge 80+",
    "softwareVersion": "1.2.0",
    "datePublished": "2024-12-01",
    "dateModified": "2025-01-15",
    "inLanguage": ["zh-CN", "ja", "en"],
    "isAccessibleForFree": true,
    "publisher": {
      "@type": "Person",
      "name": "Sandman-Ren",
      "url": "https://github.com/Sandman-Ren"
    },
    "author": {
      "@type": "Person", 
      "name": "Sandman-Ren",
      "url": "https://github.com/Sandman-Ren"
    },
    "creator": {
      "@type": "Person",
      "name": "Sandman-Ren",
      "url": "https://github.com/Sandman-Ren"
    },
    "maintainer": {
      "@type": "Person",
      "name": "Sandman-Ren",
      "url": "https://github.com/Sandman-Ren"
    },
    "license": "https://opensource.org/licenses/MIT",
    "codeRepository": "https://github.com/Sandman-Ren/biaori-vocab",
    "programmingLanguage": ["TypeScript", "JavaScript"],
    "runtimePlatform": ["Web Browser", "Node.js"],
    "downloadUrl": "https://github.com/Sandman-Ren/biaori-vocab/archive/refs/heads/main.zip",
    "installUrl": "https://sandman-ren.github.io/biaori-vocab",
    "screenshot": [
      "https://sandman-ren.github.io/biaori-vocab/screenshots/desktop-home.png",
      "https://sandman-ren.github.io/biaori-vocab/screenshots/mobile-modal.png"
    ],
    "featureList": [
      "高级词汇筛选 (Advanced vocabulary filtering)",
      "动词变位系统 (Verb conjugation system)", 
      "响应式设计 (Responsive design)",
      "词汇详情模态窗口 (Vocabulary detail modals)",
      "复制功能 (Copy functionality)",
      "收藏管理 (Bookmark management)",
      "流畅动画 (Smooth animations)",
      "移动端优化 (Mobile optimization)",
      "无障碍设计 (Accessibility features)",
      "PDF导出 (PDF export)",
      "多格式导出 (Multi-format export)",
      "键盘导航 (Keyboard navigation)"
    ],
    "keywords": "日语学习, Japanese learning, 新标准日本语, vocabulary, 词汇学习, 动词变位, responsive design, modal dialogs",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "requirements": [
      "Modern web browser",
      "JavaScript enabled",
      "Internet connection for initial load"
    ],
    "softwareHelp": {
      "@type": "WebPage",
      "name": "Documentation",
      "url": "https://sandman-ren.github.io/biaori-vocab/docs/"
    },
    "releaseNotes": "https://sandman-ren.github.io/biaori-vocab/CHANGELOG.md",
    "supportingData": {
      "@type": "Dataset",
      "name": "Japanese Vocabulary Database", 
      "description": "Comprehensive vocabulary from 新标准日本语 textbook series",
      "url": "https://sandman-ren.github.io/biaori-vocab/data/vocabulary.json"
    }
  };

  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2)
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased h-full overflow-hidden`}
        suppressHydrationWarning
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          跳转到主要内容
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={true}
          storageKey="biaori-vocab-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
