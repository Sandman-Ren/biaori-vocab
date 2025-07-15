# 响应式设计规范

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 定义完整的移动端适配策略、响应式布局系统和跨设备体验优化

## 🎯 响应式设计目标

### 核心目标
1. **无缝体验**: 在所有设备上提供一致且优化的用户体验
2. **内容优先**: 确保核心学习功能在所有屏幕尺寸下都可用
3. **性能优化**: 针对不同设备能力进行性能优化
4. **触摸友好**: 移动端触摸交互的全面优化

### 设计理念
- **移动优先**: 从最小屏幕开始设计，渐进增强
- **内容适配**: 根据屏幕空间智能调整内容展示
- **交互适配**: 不同输入方式的交互优化
- **性能感知**: 根据设备能力调整功能复杂度

## 📱 设备分类与断点

### 断点系统
```css
/* 移动端断点 */
--bp-xs: 320px;    /* 小屏手机 */
--bp-sm: 640px;    /* 大屏手机 */

/* 平板断点 */
--bp-md: 768px;    /* 竖屏平板 */
--bp-lg: 1024px;   /* 横屏平板 */

/* 桌面断点 */
--bp-xl: 1280px;   /* 小桌面 */
--bp-2xl: 1536px;  /* 大桌面 */
```

### 设备特征分析

#### 手机 (320px - 640px)
**设备特征**:
- 屏幕: 3.5" - 6.7"
- 分辨率: 375×667 - 414×896
- 像素密度: 2x - 3x
- 输入: 触摸 (单指/多指)
- 网络: 3G/4G/5G (不稳定)

**设计策略**:
- 单列布局
- 大触摸目标 (≥44px)
- 垂直滚动优先
- 简化导航
- 内容分页
- 离线优先

#### 平板 (640px - 1024px)
**设备特征**:
- 屏幕: 7" - 12.9"
- 分辨率: 768×1024 - 1366×1024
- 像素密度: 1x - 2x
- 输入: 触摸 + 可选键盘
- 网络: WiFi 为主

**设计策略**:
- 双列布局
- 侧边栏设计
- 手势导航
- 分屏支持
- 横竖屏适配

#### 桌面 (1024px+)
**设备特征**:
- 屏幕: 13" - 27"+
- 分辨率: 1366×768 - 2560×1440+
- 像素密度: 1x - 2x
- 输入: 鼠标 + 键盘
- 网络: 宽带稳定

**设计策略**:
- 多列布局
- 悬停效果
- 键盘快捷键
- 多窗口支持
- 高密度信息

## 🏗️ 布局系统

### 容器系统
```css
/* 响应式容器 */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* 断点特定宽度 */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### 网格系统
```css
/* 自适应网格 */
.grid-responsive {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--min-column-width), 1fr));
}

/* 断点特定网格 */
.grid-adaptive {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* 移动端单列 */
}

@media (min-width: 768px) {
  .grid-adaptive {
    grid-template-columns: repeat(2, 1fr); /* 平板双列 */
  }
}

@media (min-width: 1024px) {
  .grid-adaptive {
    grid-template-columns: repeat(3, 1fr); /* 桌面三列 */
  }
}
```

### 弹性布局
```css
/* 自适应弹性布局 */
.flex-responsive {
  display: flex;
  flex-wrap: wrap;
  gap: var(--flex-gap);
}

.flex-responsive > * {
  flex: 1 1 var(--flex-basis);
  min-width: var(--min-item-width);
}
```

## 📐 组件响应式设计

### 导航组件
```tsx
// components/navigation/responsive-nav.tsx
export function ResponsiveNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* 桌面导航 */}
          {!isMobile && (
            <div className="hidden md:flex space-x-8">
              <NavItem href="/" label="词汇表" />
              <NavItem href="/practice" label="练习" />
              <NavItem href="/progress" label="进度" />
            </div>
          )}
          
          {/* 移动端菜单按钮 */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <MenuIcon />
            </button>
          )}
        </div>
        
        {/* 移动端菜单 */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t"
            >
              <div className="py-2 space-y-1">
                <MobileNavItem href="/" label="词汇表" />
                <MobileNavItem href="/practice" label="练习" />
                <MobileNavItem href="/progress" label="进度" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
```

### 表格组件
```tsx
// components/table/responsive-table.tsx
export function ResponsiveVocabularyTable({ data }: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item) => (
          <VocabularyCard key={item._id} item={item} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">日语</th>
            <th className="text-left p-4">读音</th>
            <th className="text-left p-4">中文</th>
            <th className="text-left p-4">词性</th>
            <th className="text-left p-4">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <VocabularyRow key={item._id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 移动端卡片布局
function VocabularyCard({ item }: { item: VocabularyItem }) {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">
            {item.japanese_word}
          </h3>
          <p className="text-sm text-gray-600">{item.reading}</p>
        </div>
        <Badge variant="outline">{item.part_of_speech}</Badge>
      </div>
      
      <p className="text-gray-700">{item.chinese_meaning}</p>
      
      <div className="flex items-center space-x-2 pt-2">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          查看
        </Button>
        <Button variant="ghost" size="sm">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

### 筛选面板
```tsx
// components/filter/responsive-filter.tsx
export function ResponsiveFilterPanel() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);
  
  if (isMobile) {
    return (
      <>
        {/* 移动端触发按钮 */}
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full mb-4"
          variant="outline"
        >
          <Filter className="w-4 h-4 mr-2" />
          筛选条件
        </Button>
        
        {/* 移动端抽屉 */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>筛选词汇</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }
  
  // 桌面端侧边栏
  return (
    <div className="w-64 bg-white border rounded-lg p-4">
      <h3 className="font-medium mb-4">筛选条件</h3>
      <FilterContent />
    </div>
  );
}
```

### 模态框组件
```tsx
// components/modal/responsive-modal.tsx
export function ResponsiveModal({ children, ...props }: Props) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  if (isMobile) {
    // 移动端全屏模态框
    return (
      <Sheet {...props}>
        <SheetContent side="bottom" className="h-[95vh] rounded-t-lg">
          {children}
        </SheetContent>
      </Sheet>
    );
  }
  
  // 桌面端居中模态框
  return (
    <Dialog {...props}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

## 🖱️ 交互适配

### 触摸目标优化
```css
/* 触摸目标最小尺寸 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 触摸间距 */
.touch-spacing > * + * {
  margin-top: 8px;
}

@media (max-width: 640px) {
  .touch-spacing > * + * {
    margin-top: 12px; /* 移动端增加间距 */
  }
}
```

### 输入方式适配
```tsx
// hooks/use-input-method.ts
export function useInputMethod() {
  const [inputMethod, setInputMethod] = useState<'mouse' | 'touch' | 'keyboard'>('mouse');
  
  useEffect(() => {
    // 检测触摸设备
    const hasTouch = 'ontouchstart' in window;
    
    // 监听交互事件
    const handleMouseMove = () => setInputMethod('mouse');
    const handleTouchStart = () => setInputMethod('touch');
    const handleKeyDown = () => setInputMethod('keyboard');
    
    if (hasTouch) {
      setInputMethod('touch');
      document.addEventListener('touchstart', handleTouchStart);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return inputMethod;
}

// 使用示例
export function AdaptiveButton({ children, ...props }: Props) {
  const inputMethod = useInputMethod();
  
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md transition-colors',
        {
          'hover:bg-gray-100': inputMethod === 'mouse',
          'active:bg-gray-200': inputMethod === 'touch',
          'focus:ring-2 focus:ring-blue-500': inputMethod === 'keyboard',
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 手势支持
```tsx
// hooks/use-gestures.ts
import { useGesture } from '@use-gesture/react';

export function useSwipeGestures(handlers: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) {
  const bind = useGesture({
    onDrag: ({ direction: [dx, dy], velocity, cancel }) => {
      const threshold = 0.5;
      
      if (Math.abs(dx) > threshold) {
        if (dx > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
          cancel();
        } else if (dx < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
          cancel();
        }
      }
      
      if (Math.abs(dy) > threshold) {
        if (dy > 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
          cancel();
        } else if (dy < 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
          cancel();
        }
      }
    },
  });
  
  return bind;
}
```

## 🎨 视觉适配

### 字体缩放
```css
/* 响应式字体 */
.text-responsive {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}

/* 断点特定字体大小 */
.heading-responsive {
  font-size: 1.5rem;
}

@media (min-width: 640px) {
  .heading-responsive {
    font-size: 1.875rem;
  }
}

@media (min-width: 1024px) {
  .heading-responsive {
    font-size: 2.25rem;
  }
}
```

### 间距缩放
```css
/* 响应式间距 */
.spacing-responsive {
  padding: clamp(1rem, 4vw, 2rem);
  margin: clamp(0.5rem, 2vw, 1.5rem) 0;
}

/* 容器边距 */
.container-padding {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-padding {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-padding {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

### 图像适配
```css
/* 响应式图像 */
.image-responsive {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 艺术指导 */
.hero-image {
  aspect-ratio: 16/9;
}

@media (max-width: 640px) {
  .hero-image {
    aspect-ratio: 4/3; /* 移动端更方形 */
  }
}
```

## 📊 性能优化

### 资源加载优化
```tsx
// components/optimization/responsive-loader.tsx
export function ResponsiveLoader({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  
  useEffect(() => {
    // 检测网络速度
    const connection = (navigator as any).connection;
    if (connection) {
      const isSlowNetwork = connection.effectiveType === '2g' || 
                           connection.effectiveType === 'slow-2g';
      setIsSlowConnection(isSlowNetwork);
    }
  }, []);
  
  if (isMobile && isSlowConnection) {
    // 低速网络下的简化版本
    return <SimplifiedMobileView />;
  }
  
  return children;
}
```

### 图像优化
```tsx
// components/optimization/responsive-image.tsx
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

export function ResponsiveImage({ src, alt, sizes, className }: ResponsiveImageProps) {
  return (
    <picture>
      <source
        media="(max-width: 640px)"
        srcSet={`${src}?w=640&f=webp 1x, ${src}?w=1280&f=webp 2x`}
        type="image/webp"
      />
      <source
        media="(max-width: 640px)"
        srcSet={`${src}?w=640 1x, ${src}?w=1280 2x`}
      />
      <source
        srcSet={`${src}?w=1024&f=webp 1x, ${src}?w=2048&f=webp 2x`}
        type="image/webp"
      />
      <img
        src={`${src}?w=1024`}
        alt={alt}
        sizes={sizes}
        className={className}
        loading="lazy"
      />
    </picture>
  );
}
```

### 懒加载组件
```tsx
// components/optimization/lazy-component.tsx
export function LazyComponent({ threshold = 0.1, children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-32 bg-gray-100 animate-pulse" />}
    </div>
  );
}
```

## 🧪 响应式测试

### 设备测试策略
```tsx
// __tests__/responsive.test.tsx
import { render, screen } from '@testing-library/react';
import { ResponsiveComponent } from '@/components/responsive-component';

describe('Responsive Design', () => {
  const breakpoints = [
    { width: 320, name: 'Mobile Small' },
    { width: 640, name: 'Mobile Large' },
    { width: 768, name: 'Tablet' },
    { width: 1024, name: 'Desktop Small' },
    { width: 1280, name: 'Desktop Large' },
  ];
  
  breakpoints.forEach(({ width, name }) => {
    it(`renders correctly on ${name} (${width}px)`, () => {
      // Mock viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      
      render(<ResponsiveComponent />);
      
      // 测试特定断点的行为
      expect(screen.getByTestId('responsive-content')).toBeInTheDocument();
    });
  });
});
```

### 视觉回归测试
```tsx
// __tests__/visual-regression.test.tsx
import { expect, test } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  const viewports = [
    { width: 375, height: 667, name: 'iPhone' },
    { width: 768, height: 1024, name: 'iPad' },
    { width: 1440, height: 900, name: 'Desktop' },
  ];
  
  viewports.forEach(({ width, height, name }) => {
    test(`${name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // 等待加载完成
      await page.waitForLoadState('networkidle');
      
      // 截图对比
      await expect(page).toHaveScreenshot(`${name.toLowerCase()}.png`);
    });
  });
});
```

## 📱 移动端特殊优化

### iOS Safari 优化
```css
/* 解决 iOS Safari 的 100vh 问题 */
.mobile-full-height {
  height: 100vh;
  height: -webkit-fill-available;
}

/* 防止双击缩放 */
.no-zoom {
  touch-action: manipulation;
}

/* 改善滚动性能 */
.smooth-scroll {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
```

### Android 优化
```css
/* 防止 Android 系统字体缩放 */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 改善 Android 点击反馈 */
.android-tap {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}
```

### PWA 支持
```tsx
// components/pwa/responsive-pwa.tsx
export function ResponsivePWA() {
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // 检测是否在 PWA 模式
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone;
    setIsStandalone(isStandalone);
  }, []);
  
  return (
    <div className={cn({
      'pt-safe-top pb-safe-bottom': isStandalone, // PWA 安全区域
    })}>
      {/* PWA 内容 */}
    </div>
  );
}
```

## 📋 响应式检查清单

### 布局检查
- [ ] 所有断点下布局不破坏
- [ ] 水平滚动条不出现
- [ ] 内容在小屏幕下可访问
- [ ] 导航在所有设备下可用
- [ ] 关键信息在折叠线以上

### 交互检查
- [ ] 触摸目标 ≥ 44px
- [ ] 手势操作流畅
- [ ] 表单在移动端易用
- [ ] 模态框在小屏幕适配
- [ ] 键盘导航完整

### 性能检查
- [ ] 移动端加载速度 < 3秒
- [ ] 图像针对设备优化
- [ ] 字体加载优化
- [ ] 动画性能良好
- [ ] 网络适应性强

### 兼容性检查
- [ ] iOS Safari 9+
- [ ] Chrome Mobile 70+
- [ ] Samsung Internet 8+
- [ ] UC Browser 11+
- [ ] Opera Mini 支持

## 🔗 相关资源

### 测试工具
- **Chrome DevTools**: 设备模拟和调试
- **BrowserStack**: 真实设备测试
- **Playwright**: 自动化测试
- **Lighthouse**: 性能审计

### 设计工具
- **Figma**: 响应式原型
- **Zeplin**: 设计规范交付
- **Lottie**: 响应式动画
- **ImageOptim**: 图像优化

### 参考资料
- **RWD Fundamentals**: Google 响应式设计指南
- **Mobile UX Design**: 移动端用户体验最佳实践
- **Touch Interface Design**: 触摸界面设计指南

---

*本响应式设计规范确保产品在所有设备上都能提供优质体验。规范更新时请同步测试和验证。*
