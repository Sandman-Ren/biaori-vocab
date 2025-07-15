# 组件 API 文档

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 完整的组件接口文档和使用指南

## 📋 概览

本文档提供了系统中所有主要组件的完整API参考，包括属性、方法、事件和使用示例。

## 🧩 核心组件

### VocabularyTable

词汇表格组件，支持排序、筛选和交互。

#### 属性 (Props)
```typescript
interface VocabularyTableProps {
  data: VocabularyItem[];           // 词汇数据数组
  loading?: boolean;                // 加载状态
  onRowClick?: (item: VocabularyItem) => void;  // 行点击事件
  onSelectionChange?: (selected: string[]) => void;  // 选择变化
  sortConfig?: SortConfig;          // 排序配置
  onSort?: (config: SortConfig) => void;  // 排序事件
  className?: string;               // 自定义样式
}

interface SortConfig {
  field: keyof VocabularyItem;      // 排序字段
  direction: 'asc' | 'desc';        // 排序方向
}
```

#### 使用示例
```tsx
import { VocabularyTable } from '@/components/vocabulary-table';

function VocabularyPage() {
  const [data, setData] = useState<VocabularyItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const handleRowClick = (item: VocabularyItem) => {
    console.log('Clicked item:', item);
  };
  
  return (
    <VocabularyTable
      data={data}
      loading={false}
      onRowClick={handleRowClick}
      onSelectionChange={setSelectedItems}
      className="border rounded-lg"
    />
  );
}
```

#### 方法
```typescript
// 通过 ref 访问的方法
interface VocabularyTableRef {
  clearSelection: () => void;       // 清除选择
  selectAll: () => void;           // 全选
  exportSelected: (format: 'csv' | 'xlsx' | 'json') => void;  // 导出选中项
}
```

---

### VocabularyDetailModal

词汇详情模态框组件，展示完整的词汇信息。

#### 属性 (Props)
```typescript
interface VocabularyDetailModalProps {
  isOpen: boolean;                  // 是否打开
  onClose: () => void;             // 关闭回调
  vocabulary?: VocabularyItem;      // 词汇数据
  onBookmark?: (id: string, bookmarked: boolean) => void;  // 收藏回调
  onCopy?: (text: string, type: string) => void;  // 复制回调
  className?: string;               // 自定义样式
}
```

#### 使用示例
```tsx
import { VocabularyDetailModal } from '@/components/vocabulary-detail-modal';

function VocabularyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState<VocabularyItem>();
  
  const handleBookmark = (id: string, bookmarked: boolean) => {
    console.log(`${bookmarked ? 'Added' : 'Removed'} bookmark for ${id}`);
  };
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`已复制${type}`);
  };
  
  return (
    <VocabularyDetailModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      vocabulary={selectedVocabulary}
      onBookmark={handleBookmark}
      onCopy={handleCopy}
    />
  );
}
```

#### 特性
- **响应式设计**: 自动适配移动端和桌面端
- **动画效果**: 流畅的开启/关闭动画
- **键盘导航**: 支持 ESC 键关闭
- **无障碍支持**: 完整的 ARIA 属性

---

### FilterPanel

筛选面板组件，提供多维度数据筛选功能。

#### 属性 (Props)
```typescript
interface FilterPanelProps {
  filters: FilterState;             // 当前筛选状态
  onFiltersChange: (filters: FilterState) => void;  // 筛选变化回调
  options: FilterOptions;           // 筛选选项
  isOpen?: boolean;                // 是否展开
  onToggle?: () => void;           // 展开/收起回调
  className?: string;               // 自定义样式
}

interface FilterState {
  books: string[];                  // 教材筛选
  lessons: string[];               // 课程筛选
  partOfSpeech: string[];          // 词性筛选
  conjugations: string[];          // 变位筛选
  search: string;                  // 搜索关键词
}

interface FilterOptions {
  books: { id: string; name: string; }[];
  lessons: { id: string; name: string; bookId: string; }[];
  partOfSpeech: string[];
  conjugations: string[];
}
```

#### 使用示例
```tsx
import { FilterPanel } from '@/components/filter-panel';

function VocabularyPage() {
  const [filters, setFilters] = useState<FilterState>({
    books: [],
    lessons: [],
    partOfSpeech: [],
    conjugations: [],
    search: '',
  });
  
  const filterOptions = {
    books: [
      { id: '7', name: '新标准日本语初级' },
      { id: '8', name: '新标准日本语中级' },
    ],
    lessons: [
      { id: '1', name: '第1课', bookId: '7' },
      { id: '2', name: '第2课', bookId: '7' },
    ],
    partOfSpeech: ['名词', '动词', '形容词'],
    conjugations: ['现在时', '过去时', '否定'],
  };
  
  return (
    <FilterPanel
      filters={filters}
      onFiltersChange={setFilters}
      options={filterOptions}
      className="mb-6"
    />
  );
}
```

#### 方法
```typescript
interface FilterPanelRef {
  clearFilters: () => void;         // 清除所有筛选
  resetToDefault: () => void;       // 重置为默认
  exportFilters: () => string;      // 导出筛选条件
  importFilters: (config: string) => void;  // 导入筛选条件
}
```

---

### VerbConjugationDisplay

动词变位展示组件，显示完整的动词变位形式。

#### 属性 (Props)
```typescript
interface VerbConjugationDisplayProps {
  conjugations: VerbConjugations;   // 变位数据
  level?: 'beginner' | 'intermediate' | 'advanced' | 'complete';  // 显示级别
  layout?: 'grid' | 'list' | 'compact';  // 布局模式
  onConjugationClick?: (form: string, value: string) => void;  // 点击事件
  className?: string;               // 自定义样式
}

interface VerbConjugations {
  precomputed: {
    [key: string]: string;          // 变位形式映射
  };
  jmdict?: {
    [key: string]: string;          // JMdict 数据
  };
}
```

#### 使用示例
```tsx
import { VerbConjugationDisplay } from '@/components/verb-conjugation-display';

function VocabularyDetail({ vocabulary }: { vocabulary: VocabularyItem }) {
  const handleConjugationClick = (form: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`已复制 ${form}: ${value}`);
  };
  
  if (!vocabulary.conjugations) {
    return <div>此词汇没有变位形式</div>;
  }
  
  return (
    <VerbConjugationDisplay
      conjugations={vocabulary.conjugations}
      level="intermediate"
      layout="grid"
      onConjugationClick={handleConjugationClick}
      className="mt-4"
    />
  );
}
```

#### 变位级别
- **beginner**: 6种基础变位 (现在、过去、否定等)
- **intermediate**: 10种中级变位 (添加て形、可能形等)
- **advanced**: 13种高级变位 (添加被动、使役等)
- **complete**: 15种完整变位 (所有形式)

---

### Pagination

分页组件，支持页码导航和页面大小选择。

#### 属性 (Props)
```typescript
interface PaginationProps {
  currentPage: number;              // 当前页码
  totalPages: number;               // 总页数
  totalItems: number;               // 总条目数
  pageSize: number;                 // 每页大小
  onPageChange: (page: number) => void;  // 页码变化
  onPageSizeChange?: (size: number) => void;  // 页面大小变化
  showSizeSelector?: boolean;       // 是否显示大小选择器
  showInfo?: boolean;               // 是否显示信息
  className?: string;               // 自定义样式
}
```

#### 使用示例
```tsx
import { Pagination } from '@/components/pagination';

function VocabularyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const totalItems = 2847;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      showSizeSelector={true}
      showInfo={true}
      className="mt-6"
    />
  );
}
```

## 🎨 UI 组件

### Button

通用按钮组件，支持多种样式和状态。

#### 属性 (Props)
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;                // 加载状态
  icon?: React.ReactNode;          // 图标
  className?: string;               // 自定义样式
  children: React.ReactNode;        // 子元素
}
```

#### 使用示例
```tsx
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

function ActionButtons() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    setIsLoading(true);
    // 下载逻辑
    setIsLoading(false);
  };
  
  return (
    <div className="space-x-2">
      <Button variant="default" size="lg">
        主要操作
      </Button>
      
      <Button variant="outline" icon={<Download />}>
        下载
      </Button>
      
      <Button 
        variant="secondary" 
        loading={isLoading}
        onClick={handleDownload}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        异步操作
      </Button>
      
      <Button variant="ghost" size="sm">
        辅助操作
      </Button>
    </div>
  );
}
```

---

### Input

输入框组件，支持多种类型和验证。

#### 属性 (Props)
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;                   // 标签
  error?: string;                   // 错误信息
  helperText?: string;             // 帮助文本
  icon?: React.ReactNode;          // 图标
  suffix?: React.ReactNode;        // 后缀
  loading?: boolean;               // 加载状态
  className?: string;              // 自定义样式
}
```

#### 使用示例
```tsx
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

function SearchForm() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  
  const handleClear = () => {
    setQuery('');
    setError('');
  };
  
  return (
    <div className="space-y-4">
      <Input
        label="搜索词汇"
        placeholder="输入日语、读音或中文"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search />}
        suffix={
          query && (
            <button onClick={handleClear} className="p-1">
              <X className="w-4 h-4" />
            </button>
          )
        }
        error={error}
        helperText="支持模糊搜索和正则表达式"
      />
      
      <Input
        type="number"
        label="最大结果数"
        placeholder="100"
        min={1}
        max={1000}
      />
    </div>
  );
}
```

---

### Badge

标签组件，用于显示状态或分类。

#### 属性 (Props)
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}
```

#### 使用示例
```tsx
import { Badge } from '@/components/ui/badge';

function PartOfSpeechBadges({ partOfSpeech }: { partOfSpeech: string }) {
  const getVariant = (pos: string) => {
    switch (pos) {
      case '名词': return 'default';
      case '动词': return 'destructive';
      case '形容词': return 'secondary';
      default: return 'outline';
    }
  };
  
  return (
    <Badge variant={getVariant(partOfSpeech)} size="sm">
      {partOfSpeech}
    </Badge>
  );
}
```

## 🔧 工具组件

### AnimationWrapper

动画包装器组件，提供统一的动画效果。

#### 属性 (Props)
```typescript
interface AnimationWrapperProps {
  children: React.ReactNode;
  preset?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'modal' | 'drawer';
  delay?: number;                   // 延迟时间
  duration?: number;                // 动画时长
  className?: string;
}
```

#### 使用示例
```tsx
import { AnimationWrapper } from '@/components/animation/animation-wrapper';

function AnimatedList({ items }: { items: any[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <AnimationWrapper
          key={item.id}
          preset="slideUp"
          delay={index * 0.1}
        >
          <div className="p-4 border rounded-lg">
            {item.content}
          </div>
        </AnimationWrapper>
      ))}
    </div>
  );
}
```

---

### LoadingSpinner

加载指示器组件。

#### 属性 (Props)
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;                    // 加载文本
  className?: string;
}
```

#### 使用示例
```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function DataLoader() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="正在加载词汇数据..." />
      </div>
    );
  }
  
  return <div>数据内容</div>;
}
```

## 📱 响应式组件

### ResponsiveContainer

响应式容器组件，根据屏幕大小调整布局。

#### 属性 (Props)
```typescript
interface ResponsiveContainerProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;         // 移动端专用内容
  desktop?: React.ReactNode;        // 桌面端专用内容
  breakpoint?: number;              // 断点 (px)
  className?: string;
}
```

#### 使用示例
```tsx
import { ResponsiveContainer } from '@/components/responsive/responsive-container';

function VocabularyDisplay({ data }: { data: VocabularyItem[] }) {
  return (
    <ResponsiveContainer
      mobile={<VocabularyCardList data={data} />}
      desktop={<VocabularyTable data={data} />}
      breakpoint={768}
    />
  );
}
```

## 🎯 高级组件

### VirtualizedList

虚拟化列表组件，支持大量数据的高性能渲染。

#### 属性 (Props)
```typescript
interface VirtualizedListProps<T> {
  items: T[];                       // 数据项
  itemHeight: number;               // 项目高度
  containerHeight: number;          // 容器高度
  renderItem: (item: T, index: number) => React.ReactNode;  // 渲染函数
  overscan?: number;                // 预渲染数量
  className?: string;
}
```

#### 使用示例
```tsx
import { VirtualizedList } from '@/components/virtualized/virtualized-list';

function LargeVocabularyList({ vocabulary }: { vocabulary: VocabularyItem[] }) {
  const renderVocabularyItem = (item: VocabularyItem, index: number) => (
    <div className="p-4 border-b">
      <h3 className="font-medium">{item.japanese_word}</h3>
      <p className="text-sm text-gray-600">{item.chinese_meaning}</p>
    </div>
  );
  
  return (
    <VirtualizedList
      items={vocabulary}
      itemHeight={80}
      containerHeight={600}
      renderItem={renderVocabularyItem}
      overscan={5}
      className="border rounded-lg"
    />
  );
}
```

## 📋 类型定义

### 公共类型
```typescript
// 词汇项目类型
interface VocabularyItem {
  _id: string;
  book_id: string;
  lesson_id: string;
  lesson_name: string;
  lesson_url: string;
  word_number: string;
  japanese_word: string;
  reading: string;
  pronunciation_url: string | null;
  chinese_meaning: string;
  part_of_speech: string;
  example_sentences: string[];
  page_url: string;
  scraped_at: string;
  conjugations?: VerbConjugations;
}

// 动词变位类型
interface VerbConjugations {
  precomputed: {
    [key: string]: string;
  };
  jmdict?: {
    [key: string]: string;
  };
}

// 筛选状态类型
interface FilterState {
  books: string[];
  lessons: string[];
  partOfSpeech: string[];
  conjugations: string[];
  search: string;
}

// 排序配置类型
interface SortConfig {
  field: keyof VocabularyItem;
  direction: 'asc' | 'desc';
}
```

## 🔗 相关资源

### 组件库参考
- [shadcn/ui](https://ui.shadcn.com/) - 基础组件库
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件原语
- [Lucide React](https://lucide.dev/) - 图标库

### TypeScript 资源
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)

---

*本组件API文档与代码实现保持同步。组件更新时请同步更新此文档。*
