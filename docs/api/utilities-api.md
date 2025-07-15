# 工具函数 API 文档

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 完整的工具函数和库的API参考

## 📋 概览

本文档提供了系统中所有工具函数、钩子函数和实用程序的完整API参考，包括类型定义、使用示例和最佳实践。

## 🔧 核心工具函数

### 词汇处理工具 (vocabulary-utils.ts)

#### filterVocabulary
根据筛选条件过滤词汇数据。

```typescript
function filterVocabulary(
  vocabulary: VocabularyItem[],
  filters: FilterState
): VocabularyItem[]
```

**参数**:
- `vocabulary`: 词汇数据数组
- `filters`: 筛选条件对象

**返回值**: 过滤后的词汇数组

**使用示例**:
```typescript
import { filterVocabulary } from '@/lib/vocabulary-utils';

const filteredData = filterVocabulary(allVocabulary, {
  books: ['7', '8'],
  lessons: [],
  partOfSpeech: ['名词', '动词'],
  conjugations: [],
  search: '学習'
});
```

#### sortVocabulary
对词汇数据进行排序。

```typescript
function sortVocabulary(
  vocabulary: VocabularyItem[],
  sortConfig: SortConfig
): VocabularyItem[]
```

**参数**:
- `vocabulary`: 词汇数据数组  
- `sortConfig`: 排序配置对象

**使用示例**:
```typescript
const sortedData = sortVocabulary(vocabulary, {
  field: 'japanese_word',
  direction: 'asc'
});
```

#### searchVocabulary
在词汇数据中进行全文搜索。

```typescript
function searchVocabulary(
  vocabulary: VocabularyItem[],
  query: string,
  options?: SearchOptions
): VocabularyItem[]

interface SearchOptions {
  fields?: Array<keyof VocabularyItem>;  // 搜索字段
  caseSensitive?: boolean;               // 大小写敏感
  useRegex?: boolean;                    // 使用正则表达式
  maxResults?: number;                   // 最大结果数
}
```

**使用示例**:
```typescript
// 基础搜索
const results = searchVocabulary(vocabulary, '学習');

// 高级搜索
const advancedResults = searchVocabulary(vocabulary, 'がく|まな', {
  fields: ['japanese_word', 'reading'],
  useRegex: true,
  maxResults: 50
});
```

#### groupVocabularyByLesson
按课程分组词汇数据。

```typescript
function groupVocabularyByLesson(
  vocabulary: VocabularyItem[]
): Record<string, VocabularyItem[]>
```

**使用示例**:
```typescript
const groupedVocabulary = groupVocabularyByLesson(vocabulary);
// 返回: { '新标初_01': [...], '新标初_02': [...] }
```

#### getVocabularyStats
获取词汇数据的统计信息。

```typescript
function getVocabularyStats(vocabulary: VocabularyItem[]): VocabularyStats

interface VocabularyStats {
  total: number;                         // 总词汇数
  byBook: Record<string, number>;        // 按教材统计
  byPartOfSpeech: Record<string, number>; // 按词性统计
  byLesson: Record<string, number>;      // 按课程统计
  verbsWithConjugations: number;         // 带变位的动词数
  averageExamples: number;               // 平均例句数
}
```

**使用示例**:
```typescript
const stats = getVocabularyStats(vocabulary);
console.log(`总词汇: ${stats.total}`);
console.log(`动词数: ${stats.byPartOfSpeech['动词'] || 0}`);
```

### 变位处理工具 (conjugation-utils.ts)

#### getConjugationsByLevel
根据级别获取动词变位。

```typescript
function getConjugationsByLevel(
  conjugations: VerbConjugations,
  level: ConjugationLevel
): ConjugationEntry[]

type ConjugationLevel = 'beginner' | 'intermediate' | 'advanced' | 'complete';

interface ConjugationEntry {
  form: string;                          // 变位形式名称
  value: string;                         // 变位结果
  category: string;                      // 分类
  description: string;                   // 描述
}
```

**使用示例**:
```typescript
import { getConjugationsByLevel } from '@/lib/conjugation-utils';

const beginnerConjugations = getConjugationsByLevel(
  vocabulary.conjugations,
  'beginner'
);
```

#### formatConjugationName
格式化变位形式名称为中文。

```typescript
function formatConjugationName(form: string): string
```

**使用示例**:
```typescript
const chineseName = formatConjugationName('polite_present');
// 返回: "敬语现在时"
```

#### validateConjugations
验证动词变位数据的完整性。

```typescript
function validateConjugations(
  conjugations: VerbConjugations,
  partOfSpeech: string
): ValidationResult

interface ValidationResult {
  isValid: boolean;
  missing: string[];                     // 缺失的变位形式
  invalid: string[];                     // 无效的变位形式
  warnings: string[];                    // 警告信息
}
```

**使用示例**:
```typescript
const validation = validateConjugations(
  vocabulary.conjugations,
  vocabulary.part_of_speech
);

if (!validation.isValid) {
  console.warn('缺失变位:', validation.missing);
}
```

### PDF 导出工具 (pdf-utils.ts)

#### generateVocabularyPDF
生成词汇表PDF文档。

```typescript
function generateVocabularyPDF(
  vocabulary: VocabularyItem[],
  options?: PDFOptions
): Promise<void>

interface PDFOptions {
  title?: string;                        // 文档标题
  includeConjugations?: boolean;         // 包含变位表
  layout?: 'list' | 'grid' | 'cards';   // 布局模式
  fontSize?: number;                     // 字体大小
  pageSize?: 'A4' | 'Letter';           // 页面大小
  margin?: number;                       // 页边距
}
```

**使用示例**:
```typescript
import { generateVocabularyPDF } from '@/lib/pdf-utils';

await generateVocabularyPDF(selectedVocabulary, {
  title: '新标准日本语初级词汇表',
  includeConjugations: true,
  layout: 'grid',
  fontSize: 12
});
```

#### generateConjugationWorksheet
生成动词变位练习册。

```typescript
function generateConjugationWorksheet(
  verbs: VocabularyItem[],
  options?: WorksheetOptions
): Promise<void>

interface WorksheetOptions {
  level: ConjugationLevel;               // 变位级别
  includeAnswers?: boolean;              // 包含答案
  exerciseType?: 'fill' | 'choice' | 'mixed'; // 练习类型
  randomize?: boolean;                   // 随机排序
}
```

**使用示例**:
```typescript
const verbs = vocabulary.filter(item => 
  ['动1', '动2', '动3'].includes(item.part_of_speech)
);

await generateConjugationWorksheet(verbs, {
  level: 'intermediate',
  includeAnswers: false,
  exerciseType: 'fill',
  randomize: true
});
```

## 🪝 React Hooks

### useVocabularyData
管理词汇数据的状态和操作。

```typescript
function useVocabularyData(initialData?: VocabularyItem[]): {
  vocabulary: VocabularyItem[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sortConfig: SortConfig;
  filteredData: VocabularyItem[];
  setFilters: (filters: FilterState) => void;
  setSortConfig: (config: SortConfig) => void;
  refreshData: () => Promise<void>;
  exportData: (format: ExportFormat) => Promise<void>;
}
```

**使用示例**:
```typescript
import { useVocabularyData } from '@/hooks/use-vocabulary-data';

function VocabularyPage() {
  const {
    vocabulary,
    loading,
    filters,
    filteredData,
    setFilters,
    setSortConfig,
    exportData
  } = useVocabularyData();
  
  const handleExport = () => {
    exportData('xlsx');
  };
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <FilterPanel filters={filters} onFiltersChange={setFilters} />
      <VocabularyTable data={filteredData} onSort={setSortConfig} />
    </div>
  );
}
```

### useLocalStorage
本地存储状态管理。

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void]
```

**使用示例**:
```typescript
import { useLocalStorage } from '@/hooks/use-local-storage';

function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'zh-CN');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
    </div>
  );
}
```

### useDebounce
防抖处理。

```typescript
function useDebounce<T>(value: T, delay: number): T
```

**使用示例**:
```typescript
import { useDebounce } from '@/hooks/use-debounce';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      // 执行搜索
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索词汇..."
    />
  );
}
```

### useMediaQuery
媒体查询钩子。

```typescript
function useMediaQuery(query: string): boolean
```

**使用示例**:
```typescript
import { useMediaQuery } from '@/hooks/use-media-query';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  return (
    <div className={`layout ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
```

### useKeyboard
键盘快捷键处理。

```typescript
function useKeyboard(
  shortcuts: Record<string, () => void>,
  dependencies?: any[]
): void
```

**使用示例**:
```typescript
import { useKeyboard } from '@/hooks/use-keyboard';

function VocabularyTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  useKeyboard({
    'ctrl+a': () => selectAll(),
    'delete': () => deleteSelected(),
    'ctrl+c': () => copySelected(),
    'escape': () => clearSelection(),
  }, [selectedItems]);
  
  return <table>...</table>;
}
```

## 🛠️ 实用工具

### 通用工具 (utils.ts)

#### cn (className utility)
合并 CSS 类名。

```typescript
function cn(...inputs: ClassValue[]): string
```

**使用示例**:
```typescript
import { cn } from '@/lib/utils';

const buttonClass = cn(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-900',
  disabled && 'opacity-50 cursor-not-allowed',
  className
);
```

#### formatDate
格式化日期。

```typescript
function formatDate(
  date: string | Date,
  format?: 'full' | 'short' | 'relative'
): string
```

**使用示例**:
```typescript
const formattedDate = formatDate(vocabulary.scraped_at, 'relative');
// 返回: "2天前"
```

#### generateId
生成唯一标识符。

```typescript
function generateId(prefix?: string): string
```

**使用示例**:
```typescript
const id = generateId('vocab'); // "vocab_abc123def456"
```

#### sleep
异步延迟函数。

```typescript
function sleep(ms: number): Promise<void>
```

**使用示例**:
```typescript
await sleep(1000); // 等待1秒
```

### 文本处理工具

#### highlightText
高亮显示搜索结果。

```typescript
function highlightText(
  text: string,
  query: string,
  className?: string
): React.ReactNode
```

**使用示例**:
```typescript
import { highlightText } from '@/lib/text-utils';

function SearchResult({ text, query }: Props) {
  return (
    <div>
      {highlightText(text, query, 'bg-yellow-200')}
    </div>
  );
}
```

#### truncateText
截断文本。

```typescript
function truncateText(
  text: string,
  maxLength: number,
  suffix?: string
): string
```

**使用示例**:
```typescript
const shortText = truncateText(longDescription, 100, '...');
```

#### removeAccents
移除重音符号。

```typescript
function removeAccents(text: string): string
```

**使用示例**:
```typescript
const normalized = removeAccents('café'); // "cafe"
```

### 数据验证工具

#### validateVocabularyItem
验证词汇项数据。

```typescript
function validateVocabularyItem(item: any): {
  isValid: boolean;
  errors: string[];
}
```

**使用示例**:
```typescript
const validation = validateVocabularyItem(vocabularyData);
if (!validation.isValid) {
  console.error('数据验证失败:', validation.errors);
}
```

#### sanitizeInput
清理用户输入。

```typescript
function sanitizeInput(
  input: string,
  options?: SanitizeOptions
): string

interface SanitizeOptions {
  allowHTML?: boolean;
  maxLength?: number;
  trimWhitespace?: boolean;
}
```

**使用示例**:
```typescript
const cleanInput = sanitizeInput(userInput, {
  allowHTML: false,
  maxLength: 100,
  trimWhitespace: true
});
```

## 📊 数据处理工具

### 导出工具

#### exportToCSV
导出为CSV格式。

```typescript
function exportToCSV(
  data: any[],
  filename: string,
  options?: CSVOptions
): void

interface CSVOptions {
  headers?: string[];                    // 自定义表头
  delimiter?: string;                    // 分隔符
  encoding?: string;                     // 编码
  includeBOM?: boolean;                  // 包含BOM
}
```

**使用示例**:
```typescript
import { exportToCSV } from '@/lib/export-utils';

exportToCSV(vocabulary, 'vocabulary.csv', {
  headers: ['日语', '读音', '中文', '词性'],
  delimiter: ',',
  includeBOM: true
});
```

#### exportToXLSX
导出为Excel格式。

```typescript
function exportToXLSX(
  data: any[],
  filename: string,
  options?: XLSXOptions
): void

interface XLSXOptions {
  sheetName?: string;                    // 工作表名称
  headers?: string[];                    // 表头
  formatting?: CellFormatting;           // 单元格格式
}
```

**使用示例**:
```typescript
exportToXLSX(vocabulary, 'vocabulary.xlsx', {
  sheetName: '词汇表',
  headers: ['日语', '读音', '中文', '词性'],
  formatting: {
    headerStyle: { bold: true, backgroundColor: '#f0f0f0' }
  }
});
```

#### exportToJSON
导出为JSON格式。

```typescript
function exportToJSON(
  data: any,
  filename: string,
  options?: JSONOptions
): void

interface JSONOptions {
  pretty?: boolean;                      // 格式化输出
  exclude?: string[];                    // 排除字段
  transform?: (data: any) => any;        // 数据转换
}
```

### 数据转换工具

#### transformVocabularyForExport
转换词汇数据用于导出。

```typescript
function transformVocabularyForExport(
  vocabulary: VocabularyItem[],
  format: ExportFormat,
  options?: TransformOptions
): any[]

type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

interface TransformOptions {
  includeConjugations?: boolean;
  flattenStructure?: boolean;
  customFields?: string[];
}
```

**使用示例**:
```typescript
const exportData = transformVocabularyForExport(vocabulary, 'csv', {
  includeConjugations: false,
  flattenStructure: true,
  customFields: ['japanese_word', 'reading', 'chinese_meaning']
});
```

## 🎯 性能工具

### 缓存工具

#### createCache
创建内存缓存。

```typescript
function createCache<T>(
  maxSize?: number,
  ttl?: number
): Cache<T>

interface Cache<T> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  delete: (key: string) => boolean;
  clear: () => void;
  size: number;
}
```

**使用示例**:
```typescript
import { createCache } from '@/lib/cache-utils';

const vocabularyCache = createCache<VocabularyItem[]>(100, 5 * 60 * 1000);

function getCachedVocabulary(filters: FilterState): VocabularyItem[] {
  const key = JSON.stringify(filters);
  let result = vocabularyCache.get(key);
  
  if (!result) {
    result = filterVocabulary(allVocabulary, filters);
    vocabularyCache.set(key, result);
  }
  
  return result;
}
```

### 批处理工具

#### batchProcess
批量处理数据。

```typescript
function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize?: number,
  delay?: number
): Promise<R[]>
```

**使用示例**:
```typescript
const results = await batchProcess(
  largeVocabularyList,
  async (item) => await processVocabularyItem(item),
  10,  // 每批10个
  100  // 批次间延迟100ms
);
```

## 📱 移动端工具

### 触摸工具

#### detectSwipe
检测滑动手势。

```typescript
function detectSwipe(
  element: HTMLElement,
  callbacks: SwipeCallbacks
): () => void

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}
```

**使用示例**:
```typescript
useEffect(() => {
  const cleanup = detectSwipe(cardRef.current, {
    onSwipeLeft: () => nextCard(),
    onSwipeRight: () => prevCard(),
  });
  
  return cleanup;
}, []);
```

### 设备检测

#### getDeviceInfo
获取设备信息。

```typescript
function getDeviceInfo(): DeviceInfo

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  platform: string;
  userAgent: string;
  screenSize: { width: number; height: number; };
  pixelRatio: number;
}
```

**使用示例**:
```typescript
const deviceInfo = getDeviceInfo();
console.log(`设备类型: ${deviceInfo.isMobile ? '手机' : '桌面'}`);
```

## 🔍 调试工具

### 日志工具

#### createLogger
创建日志记录器。

```typescript
function createLogger(
  name: string,
  level?: LogLevel
): Logger

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}
```

**使用示例**:
```typescript
import { createLogger } from '@/lib/logger-utils';

const logger = createLogger('VocabularyComponent', 'info');

function VocabularyComponent() {
  useEffect(() => {
    logger.info('组件已挂载');
    return () => logger.info('组件已卸载');
  }, []);
  
  const handleError = (error: Error) => {
    logger.error('处理词汇时出错:', error);
  };
}
```

### 性能监控

#### measurePerformance
性能测量工具。

```typescript
function measurePerformance<T>(
  name: string,
  fn: () => T
): T

function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T>
```

**使用示例**:
```typescript
const result = measurePerformance('filterVocabulary', () => {
  return filterVocabulary(vocabulary, filters);
});

const asyncResult = await measurePerformanceAsync('loadVocabulary', () => {
  return fetch('/api/vocabulary').then(res => res.json());
});
```

## 📋 类型定义汇总

```typescript
// 导出所有主要类型
export type {
  VocabularyItem,
  VerbConjugations,
  FilterState,
  SortConfig,
  ConjugationLevel,
  ExportFormat,
  PDFOptions,
  SearchOptions,
  VocabularyStats,
  DeviceInfo,
  Logger,
  Cache,
} from './types';
```

## 🔗 相关资源

### 开发工具
- [TypeScript](https://www.typescriptlang.org/) - 类型系统
- [React](https://react.dev/) - UI 框架
- [Lodash](https://lodash.com/) - 工具函数库

### 测试工具
- [Jest](https://jestjs.io/) - 单元测试
- [React Testing Library](https://testing-library.com/react) - 组件测试

---

*本工具函数API文档与代码实现保持同步。函数更新时请同步更新此文档。*
