# 动画系统设计

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 定义完整的动画架构、配置标准和最佳实践

## 🎯 动画设计目标

### 核心目标
1. **增强用户体验**: 通过动画提供清晰的视觉反馈
2. **引导用户注意**: 突出重要信息和状态变化
3. **提升感知性能**: 通过动画缓解等待焦虑
4. **品牌个性表达**: 体现产品的专业性和友好性

### 设计原则
- **功能性优先**: 动画服务于功能，不是装饰
- **性能考虑**: 60fps流畅体验，避免阻塞交互
- **可控性**: 用户可以禁用或调节动画
- **一致性**: 统一的动画语言和参数

## 🏗️ 技术架构

### 动画技术栈
- **Framer Motion**: 主要动画库
- **CSS Transitions**: 简单状态切换
- **CSS Animations**: 循环和关键帧动画
- **React Spring**: 复杂物理动画（备选）

### 架构分层
```
用户交互层
    ↓
动画组件层 (AnimationWrapper, MotionComponents)
    ↓
动画配置层 (AnimationConfig, Presets)
    ↓
Framer Motion 引擎
    ↓
浏览器渲染层
```

## ⚙️ 动画配置系统

### 全局动画配置
```typescript
// lib/animation-config.ts
export const AnimationConfig = {
  // 动画时长
  duration: {
    fast: 0.15,      // 150ms - 微交互
    normal: 0.25,    // 250ms - 标准转场
    slow: 0.35,      // 350ms - 复杂动画
    xslow: 0.5,      // 500ms - 页面转场
  },
  
  // 缓动函数
  easing: {
    easeOut: [0.215, 0.610, 0.355, 1.000],
    easeIn: [0.755, 0.050, 0.855, 0.060],
    easeInOut: [0.645, 0.045, 0.355, 1.000],
    spring: [0.175, 0.885, 0.320, 1.275],
  },
  
  // 弹簧物理参数
  spring: {
    gentle: { type: "spring", damping: 20, stiffness: 300 },
    moderate: { type: "spring", damping: 15, stiffness: 400 },
    bouncy: { type: "spring", damping: 10, stiffness: 600 },
  },
  
  // 减少动画偏好
  reducedMotion: {
    duration: 0.01,
    easing: "linear",
  },
} as const;
```

### 动画预设系统
```typescript
// lib/animation-presets.ts
export const AnimationPresets = {
  // 淡入淡出
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: AnimationConfig.duration.normal },
  },
  
  // 从下方滑入
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: AnimationConfig.spring.gentle,
  },
  
  // 缩放弹入
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: AnimationConfig.spring.moderate,
  },
  
  // 模态框动画
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: AnimationConfig.spring.gentle,
  },
  
  // 抽屉动画
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: AnimationConfig.spring.moderate,
  },
  
  // 列表项动画
  listItem: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { 
      ...AnimationConfig.spring.gentle,
      delay: 0.1,  // 错开显示
    },
  },
} as const;
```

## 🎬 核心动画组件

### 通用动画包装器
```tsx
// components/animation/motion-wrapper.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationPresets, AnimationConfig } from '@/lib/animation-config';

interface MotionWrapperProps {
  children: React.ReactNode;
  preset?: keyof typeof AnimationPresets;
  custom?: any;
  delay?: number;
  className?: string;
  reducedMotion?: boolean;
}

export function MotionWrapper({
  children,
  preset = 'fadeIn',
  custom,
  delay = 0,
  className,
  reducedMotion,
}: MotionWrapperProps) {
  const animationConfig = reducedMotion 
    ? AnimationConfig.reducedMotion
    : AnimationPresets[preset];
    
  const transitionWithDelay = {
    ...animationConfig.transition,
    delay,
  };

  return (
    <motion.div
      className={className}
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={transitionWithDelay}
      custom={custom}
    >
      {children}
    </motion.div>
  );
}
```

### 交错动画组件
```tsx
// components/animation/stagger-container.tsx
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 条件动画组件
```tsx
// components/animation/conditional-motion.tsx
interface ConditionalMotionProps {
  children: React.ReactNode;
  condition: boolean;
  truePreset?: keyof typeof AnimationPresets;
  falsePreset?: keyof typeof AnimationPresets;
  className?: string;
}

export function ConditionalMotion({
  children,
  condition,
  truePreset = 'fadeIn',
  falsePreset = 'fadeIn',
  className,
}: ConditionalMotionProps) {
  const preset = condition ? truePreset : falsePreset;
  
  return (
    <AnimatePresence mode="wait">
      <MotionWrapper
        key={condition ? 'true' : 'false'}
        preset={preset}
        className={className}
      >
        {children}
      </MotionWrapper>
    </AnimatePresence>
  );
}
```

## 🎨 具体动画实现

### 模态框动画
```tsx
// components/vocabulary-detail-modal.tsx 中的动画实现
export function VocabularyDetailModal({ isOpen, onClose, vocabulary }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩动画 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.duration.fast }}
            onClick={onClose}
          />
          
          {/* 模态框内容动画 */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={AnimationPresets.modal}
          >
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* 模态框内容 */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 表格行动画
```tsx
// components/vocabulary-table.tsx 中的动画实现
export function VocabularyRow({ item, index }: Props) {
  return (
    <motion.tr
      className="border-b hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...AnimationConfig.spring.gentle,
        delay: index * 0.02, // 错开动画
      }}
      whileHover={{
        backgroundColor: "#f9fafb",
        transition: { duration: AnimationConfig.duration.fast },
      }}
    >
      {/* 表格内容 */}
    </motion.tr>
  );
}
```

### 筛选面板动画
```tsx
// components/filter-panel.tsx 中的动画实现
export function FilterPanel({ isOpen }: Props) {
  return (
    <motion.div
      className="bg-white border rounded-lg p-4"
      initial={false}
      animate={{
        height: isOpen ? "auto" : 48,
        opacity: isOpen ? 1 : 0.8,
      }}
      transition={AnimationConfig.spring.gentle}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={AnimationConfig.spring.gentle}
          >
            {/* 筛选选项内容 */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### 按钮交互动画
```tsx
// components/ui/button.tsx 中的动画实现
export function Button({ children, variant, ...props }: Props) {
  return (
    <motion.button
      className={cn(buttonVariants({ variant }))}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: AnimationConfig.duration.fast }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

## 🔄 页面转场动画

### 路由转场系统
```tsx
// components/animation/page-transition.tsx
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={usePathname()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: AnimationConfig.duration.normal,
          ease: AnimationConfig.easing.easeInOut,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 加载状态动画
```tsx
// components/animation/loading-skeleton.tsx
export function LoadingSkeleton() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: AnimationConfig.duration.fast }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-16 bg-gray-200 rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.div>
  );
}
```

## 📱 响应式动画

### 设备适配动画
```tsx
// hooks/use-responsive-animation.ts
export function useResponsiveAnimation() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return {
    // 移动端减少动画复杂度
    duration: isMobile 
      ? AnimationConfig.duration.fast 
      : AnimationConfig.duration.normal,
      
    // 移动端禁用悬停动画
    whileHover: isMobile ? {} : { scale: 1.02 },
    
    // 移动端减少弹性
    spring: isMobile 
      ? AnimationConfig.spring.gentle 
      : AnimationConfig.spring.moderate,
  };
}
```

### 性能优化配置
```tsx
// components/animation/performance-wrapper.tsx
export function PerformanceWrapper({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    // 检测设备性能
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType === '2g') {
      setIsLowEnd(true);
    }
  }, []);
  
  const animationConfig = useMemo(() => {
    if (prefersReducedMotion || isLowEnd) {
      return AnimationConfig.reducedMotion;
    }
    return AnimationConfig;
  }, [prefersReducedMotion, isLowEnd]);
  
  return (
    <MotionConfigProvider config={animationConfig}>
      {children}
    </MotionConfigProvider>
  );
}
```

## 🎛️ 动画控制系统

### 全局动画控制
```tsx
// contexts/animation-context.tsx
interface AnimationContextType {
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

export const AnimationContext = createContext<AnimationContextType | null>(null);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setEnabled] = useState(true);
  const [speed, setSpeed] = useState(1);
  
  return (
    <AnimationContext.Provider value={{ isEnabled, setEnabled, speed, setSpeed }}>
      <MotionConfig reducedMotion={isEnabled ? "never" : "always"}>
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  );
}
```

### 用户偏好设置
```tsx
// components/animation/animation-settings.tsx
export function AnimationSettings() {
  const { isEnabled, setEnabled, speed, setSpeed } = useAnimationContext();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label>启用动画</label>
        <Switch checked={isEnabled} onCheckedChange={setEnabled} />
      </div>
      
      <div className="space-y-2">
        <label>动画速度</label>
        <Slider
          value={[speed]}
          onValueChange={([value]) => setSpeed(value)}
          min={0.5}
          max={2}
          step={0.1}
        />
      </div>
    </div>
  );
}
```

## 🧪 动画测试

### 视觉回归测试
```tsx
// __tests__/animations.test.tsx
import { render, screen } from '@testing-library/react';
import { MotionWrapper } from '@/components/animation/motion-wrapper';

describe('Animation Components', () => {
  it('respects reduced motion preference', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => ({
        matches: true, // prefers-reduced-motion: reduce
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
    
    render(
      <MotionWrapper preset="fadeIn">
        <div>Test Content</div>
      </MotionWrapper>
    );
    
    // 验证动画被禁用
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
```

### 性能测试
```tsx
// __tests__/animation-performance.test.tsx
describe('Animation Performance', () => {
  it('maintains 60fps during animation', async () => {
    const performanceEntries: number[] = [];
    
    // 监听帧率
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        performanceEntries.push(entry.duration);
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    // 触发动画
    render(<MotionWrapper preset="slideUp">Content</MotionWrapper>);
    
    // 等待动画完成
    await waitFor(() => {
      expect(performanceEntries.length).toBeGreaterThan(0);
    });
    
    // 验证帧率
    const avgFrameTime = performanceEntries.reduce((a, b) => a + b) / performanceEntries.length;
    expect(avgFrameTime).toBeLessThan(16.67); // 60fps
  });
});
```

## 📊 动画性能监控

### 性能指标
```typescript
// lib/animation-monitor.ts
export class AnimationMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  
  startMonitoring() {
    const checkFrame = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        
        // 报告性能
        console.log(`Animation FPS: ${fps}`);
        
        // 如果帧率过低，建议降级
        if (fps < 30) {
          this.suggestPerformanceMode();
        }
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFrame);
    };
    
    requestAnimationFrame(checkFrame);
  }
  
  private suggestPerformanceMode() {
    // 建议用户启用性能模式
    console.warn('Low FPS detected, consider enabling performance mode');
  }
}
```

## 📋 动画最佳实践

### 性能优化
1. **合成层优化**: 使用 `transform` 和 `opacity` 而非布局属性
2. **will-change**: 为复杂动画预告浏览器
3. **requestAnimationFrame**: 同步动画到浏览器刷新率
4. **动画分批**: 避免同时运行过多动画

### 用户体验
1. **减少动画偏好**: 尊重 `prefers-reduced-motion`
2. **动画可控**: 提供禁用和调速选项
3. **有意义动画**: 每个动画都有明确目的
4. **流畅体验**: 确保60fps流畅度

### 开发规范
1. **预设优先**: 使用标准化的动画预设
2. **配置集中**: 统一管理动画参数
3. **组件化**: 可复用的动画组件
4. **测试覆盖**: 动画的回归和性能测试

## 🔗 相关资源

### 官方文档
- [Framer Motion 官方文档](https://www.framer.com/motion/)
- [CSS Animation 指南](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

### 设计参考
- [Material Motion](https://material.io/design/motion/)
- [Apple HIG Animation](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/animation/)
- [12 Principles of Animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)

---

*本动画系统文档与代码实现保持同步。动画更新时请同步更新此文档。*
