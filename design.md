# 中日交流标准日本语 - 词汇学习系统设计文档

## Overview

A modernized, mobile-first vocabulary learning application for Chinese-speaking Japanese language learners. Completely localized interface with advanced verb conjugation support, smooth animations, and responsive design optimized for the 新标准日本语 textbook series.

## Core Philosophy

- **中文本土化**: Fully localized Chinese interface for native Chinese speakers
- **移动优先**: Mobile-first design with desktop enhancement
- **动画交互**: Smooth, spring-based animations for professional user experience
- **即时响应**: Immediate interactivity without blocking animations
- **渐进增强**: Progressive enhancement from basic functionality to advanced features
- **数据探索**: Flexible data exploration with multi-dimensional filtering
- **动词重点**: Special emphasis on verb conjugation learning and practice

## Localization Strategy

### Interface Translation
- **完全中文化**: All UI elements translated to Simplified Chinese
- **术语统一**: Consistent terminology throughout the application
- **文化适应**: UI patterns adapted for Chinese user expectations
- **字体支持**: Optimized typography for Chinese characters

### Educational Context
- **新标日教材**: Designed specifically for 新标准日本语 textbook series
- **中文释义**: Chinese meanings and grammatical explanations
- **学习习惯**: Interface design based on Chinese learning patterns

## Data Structure

### Vocabulary Properties (Filterable)
```json
{
  "book_id": "7",                    // 教材系列标识符
  "lesson_id": "321",               // 课程唯一标识符  
  "lesson_name": "新标初_34",        // 可读课程名称
  "japanese_word": "カレンダー",      // 日语词汇
  "reading": "カレンダー",           // 发音/读音
  "chinese_meaning": "挂历，日历",    // 中文释义
  "part_of_speech": "名词",          // 词性类别
  "example_sentences": [            // 使用例句及翻译
    "卓上カレンダー / 台历。",
    "園芸カレンダー / 农艺全年行事表。"
  ],
  "conjugations": {                 // 动词变位形式（仅动词）
    "polite_present": "します",       // 现在时（敬语）
    "casual_present": "する",        // 现在时（简体）
    "polite_past": "しました",        // 过去时（敬语）
    "casual_past": "した",           // 过去时（简体）
    "polite_negative": "しません",    // 否定（敬语）
    "casual_negative": "しない",      // 否定（简体）
    "te_form": "して",               // Te形
    "potential": "できる",            // 可能形
    "passive": "される",              // 被动形
    "causative": "させる",            // 使役形
    "imperative": "しろ",             // 命令形
    "conditional": "すれば",          // 条件形
    "volitional": "しよう"            // 意志形
  }
}
```

### Verb Conjugation System

#### Conjugation Forms (15 Total)
```typescript
interface VerbConjugations {
  // 基础形式 (6个)
  polite_present: string;     // 现在时（敬语）- ます形
  casual_present: string;     // 现在时（简体）- 辞书形
  polite_past: string;        // 过去时（敬语）- ました形
  casual_past: string;        // 过去时（简体）- た形
  polite_negative: string;    // 否定（敬语）- ません形
  casual_negative: string;    // 否定（简体）- ない形
  
  // 中级形式 (4个)
  polite_past_negative: string;  // 过去否定（敬语）- ませんでした形
  casual_past_negative: string; // 过去否定（简体）- なかった形
  te_form: string;               // Te形 - 连接形
  potential: string;             // 可能形 - 能够...
  
  // 高级形式 (5个)
  passive: string;               // 被动形 - 被...
  causative: string;             // 使役形 - 让/使某人...
  imperative: string;            // 命令形 - 命令形
  conditional: string;           // 条件形 - 如果/当...
  volitional: string;            // 意志形 - 我们...吧
}
```

#### Difficulty Levels
- **初级 (Beginner)**: 6 basic forms - 基础现在时、过去时、否定形式
- **中级 (Intermediate)**: 10 forms - 包含可能形和Te形
- **高级 (Advanced)**: 13 forms - 包含使役形和被动形
- **全部形式 (Complete)**: All 15 conjugation forms

### Metadata Properties (Non-filterable)
- `lesson_url`: Source URL for the lesson
- `word_number`: Position within lesson
- `pronunciation_url`: Audio file reference (typically null)
- `page_url`: Source page URL
- `scraped_at`: Data collection timestamp

## User Interface Design

### Responsive Layout Strategy

#### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: 中日交流标准日本语 + 词数统计 + 导出操作                   │
├─────────────────┬───────────────────────────────────────────────┤
│                 │                                               │
│ 筛选面板        │ 主表格                                        │
│ (可折叠侧边栏)   │ - 可排序列                                    │
│                 │ - 可选择行                                    │
│ - 教材筛选      │ - 动词变位展开                                │
│ - 课程筛选      │ - 分页控制                                    │
│ - 词性筛选      │                                               │
│ - 动词变位      │                                               │
│ - 文本搜索      │                                               │
│                 │                                               │
└─────────────────┴───────────────────────────────────────────────┘
```

#### Mobile Layout (<1024px)
```
┌─────────────────────────────────────────────────────────────────┐
│ 移动端头部: 标题 + 筛选按钮 + 导出按钮                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 卡片视图                                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [☐] 日语单词     [★] [⌄]                                    │ │
│ │     读音                                                    │ │
│ │ 中文释义                                                    │ │
│ │ [词性] 课程名                    X个例句                     │ │
│ │ ┌─ 动词变位展开区域 ─┐                                     │ │
│ │ │ 现在时（敬语）: します                                   │ │
│ │ │ 现在时（简体）: する                                     │ │
│ │ └─────────────────────┘                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                              [+] 浮动操作按钮                   │
└─────────────────────────────────────────────────────────────────┘
```

### Animation System Architecture

#### Core Animation Principles
```typescript
// 标准弹簧配置
const SPRING_CONFIG = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

// 动画类型
interface AnimationTypes {
  layout: "layout changes and repositioning",
  entrance: "component mounting animations", 
  interaction: "hover and click feedback",
  expansion: "collapsible content reveal",
  transition: "state change animations"
}
```

#### Animated Components
1. **FilterPanel**: 
   - 可折叠面板 with spring animation
   - 独立滚动 with hidden scrollbars
   - 即时交互 without blocking

2. **VocabularyTable**:
   - 行布局动画 for smooth repositioning
   - 动词展开 with height and opacity transitions
   - 雪佛龙图标 smooth rotation

3. **Mobile Cards**:
   - 卡片布局 animations for filtering/sorting
   - 动词展开 with margin and height animation
   - 触摸反馈 for interaction states

### Filter Panel Components (Localized)

#### 1. 教材筛选 (Books Filter)
```
📚 教材 (2)
[全选 (3)] [全不选]
☐ Book 7 (新标初) - 1,247 单词
☐ Book 8 (新标中) - 892 单词  
☐ Book 9 (新标高) - 692 单词
```

#### 2. 课程筛选 (Lessons Filter)
```
📖 课程 (5)
[搜索课程...                    ]
[全选 (156)] [全不选]
☐ 新标初_34 (23 单词)
☐ 新标初_33 (24 单词)
☐ 新标初_32 (25 单词)
[显示更多...]
```

#### 3. 词性筛选 (Parts of Speech)
```
🏷️ 词性 (3)
[全选 (12)] [全不选]
☐ 名词 - 1,247 单词
☐ 动1 - 346 单词
☐ 动2 - 177 单词
☐ 形容词 - 234 单词
☐ 副词 - 89 单词
```

#### 4. 动词变位筛选 (Verb Conjugations)
```
🎌 动词变位 (已选择 6 个)
快速预设：
[初级 (6)] [中级 (10)] [高级 (13)] [全部形式 (15)]

[全选 (15)] [全不选]

单独形式：
基础形式
☐ 现在时（敬语） - ます形
☐ 现在时（简体） - 辞书形
☐ 过去时（敬语） - ました形

中级形式  
☐ Te形 - 连接形
☐ 可能形 - 能够...

高级形式
☐ 被动形 - 被...
☐ 使役形 - 让/使某人...
```

#### 5. 文本搜索 (Text Search)
```
🔍 搜索 (生效中)
[日语、读音、含义...            ]

搜索选项 ▼
[全选 (4)] [全不选]
☐ 日语
☐ 读音  
☐ 含义
☐ 例句
```
```

### Main Table Structure (Desktop)

| 列名 | 内容 | 可排序 | 描述 |
|------|------|--------|------|
| 选择 | Checkbox | 否 | 行选择用于批量操作 |
| 日语 | japanese_word | 是 | 主要词汇单词 |
| 读音 | reading | 是 | 发音指南 |
| 含义 | chinese_meaning | 是 | 中文翻译 |
| 词性 | part_of_speech | 是 | 语法类别（带颜色编码） |
| 课程 | lesson_name | 是 | 来源课程 |
| 例句 | example_sentences.length | 是 | 例句数量 |
| 操作 | Buttons | 否 | 查看详情、收藏 |
| 展开 | Chevron | 否 | 动词变位展开（仅动词） |

### Mobile Card Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [☐] 日语单词                              [★] [⌄]          │
│     读音                                                    │
│ ─────────────────────────────────────────────────────────── │
│ 中文含义                                                    │
│ [词性标签]                           课程名     X个例句     │
│                                                             │
│ ┌── 动词变位展开区域（动画显示/隐藏）──┐                    │
│ │ 动词变位 (6 个形式)        [1类动词] │                    │
│ │ ─────────────────────────────────── │                    │
│ │ 现在时（敬语）  します        基础   │                    │
│ │ 现在时（简体）  する          基础   │                    │
│ │ 过去时（敬语）  しました      基础   │                    │
│ └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Export Functionality

#### Desktop Export
```
导出 ▼
├── CSV格式 (.csv)
├── Excel格式 (.xlsx) 
└── JSON格式 (.json)
```

#### Mobile Export Options
1. **头部导出按钮**: Modal选择格式
2. **浮动操作按钮**: 
   ```
   [+] ──┬── 📁 导出选中
         ├── 📊 练习模式  
         └── 🎯 快速操作
   ```

### Table Features

#### 排序功能 (Sorting)
- 点击列标题进行排序
- 支持升序/降序
- 排序列和方向的视觉指示器

#### 行选择 (Row Selection)  
- 单行复选框选择
- "全选"功能（当前筛选结果）
- 选中行的批量操作

#### 动词展开 (Verb Expansion)
- 动词行显示雪佛龙图标 (▷)
- 点击展开显示选中的变位形式
- 平滑的弹簧动画过渡
- 移动端和桌面端均支持

#### 分页控制 (Pagination)
- 可配置页面大小 (25, 50, 100, 200 行)
- 页面导航：首页/上一页/下一页/末页
- 跳转到指定页面
- 总结果数显示

### 颜色编码系统 (Color Coding)

#### 词性标签 (Parts of Speech)
- 🟢 **名词**: 绿色标签
- 🔵 **动1**: 蓝色标签（一类动词）
- 🟣 **动2**: 紫色标签（二类动词）  
- � **动3**: 红色标签（三类动词）
- � **形容词**: 黄色标签
- 🟠 **副词**: 橙色标签

#### 行状态 (Row States)
- **默认**: 白色背景
- **悬停**: 浅灰色背景
- **选中**: 浅蓝色背景，左侧蓝色边框
- **已收藏**: 行中显示黄色星形图标

## User Workflows

### Scenario 1: Study Specific Lessons
```
1. User wants to review vocabulary from lessons 30-35
2. In Lessons filter:
   - Search for "30"
   - Check: 新标初_30, 新标初_31, 新标初_32, 新标初_33, 新标初_34, 新标初_35
3. Table updates to show only words from selected lessons
4. User can further filter by part of speech if needed
5. Select specific words and send to practice mode
```

### Scenario 2: Focus on Specific Word Types
```
1. User wants to practice all verbs across multiple books
2. In Parts of Speech filter:
   - Check: 动词 (Verb)
3. In Books filter:
   - Check: Book 7, Book 8
4. Table shows all verbs from selected books
5. Sort by lesson to see progression
6. Practice conjugations for selected verbs
```

### Scenario 3: Search for Specific Topics
```
1. User wants to find all food-related vocabulary
2. In Text Search:
   - Enter "食" or "food"
   - Enable search in: Japanese word, Chinese meaning, Example sentences
3. Table shows all matching results across all lessons
4. User can further refine by lesson or word type
5. Create custom study set from results
```

### Scenario 4: Review Difficult Words
```
1. User has bookmarked difficult words during previous study
2. Apply filter: "Bookmarked only"
3. Table shows only previously marked difficult words
4. Sort by "last practiced" to prioritize older words
5. Practice selected words
```

## Technical Implementation

### Data Loading Strategy
- Load vocabulary JSON at build time for static generation
- Create search indices for fast text searching
- Pre-compute filter counts (words per lesson, per part of speech)

### Filtering Logic
- Client-side filtering for real-time responsiveness
- Combine multiple filter types with AND logic
- Text search uses fuzzy matching across multiple fields
- URL state management for bookmarkable filter combinations

### Performance Considerations
- Virtual scrolling for large result sets
- Debounced search input (300ms delay)
- Lazy loading of example sentences in details view
- Efficient re-rendering with React.memo or similar optimization

### State Management
```typescript
interface FilterState {
  books: string[];           // Selected book IDs
  lessons: string[];         // Selected lesson names
  partsOfSpeech: string[];   // Selected parts of speech
  textSearch: string;        // Search query
  searchFields: string[];    // Which fields to search
  sortColumn: string;        // Current sort column
  sortDirection: 'asc' | 'desc';
  selectedRows: string[];    // Selected vocabulary IDs
  currentPage: number;
  pageSize: number;
}
```

### URL Structure
```
/vocabulary?
  books=7,8&
  lessons=新标初_30,新标初_31&
  pos=名词,动词&
  search=食べる&
  sort=japanese_word&
  dir=asc&
  page=2&
  size=50
```

## Features for Future Implementation

### Study Integration
- "Practice Selected" button in header
- Multiple practice modes: flashcards, conjugation, fill-in-the-blank
- Progress tracking integration
- Spaced repetition scheduling

### Export Capabilities
- Export filtered results to CSV/JSON
- Print-friendly vocabulary lists
- Share filter combinations via URL

### Advanced Filtering
- Date-based filters (recently added words)
- Difficulty level assignment and filtering
- Custom tags and categories
- Frequency-based filtering (common vs rare words)

### User Personalization
- Save favorite filter combinations
- Bookmark difficult words
- Study history and progress tracking
- Custom notes on vocabulary items

## Design Principles

1. **Data Transparency**: All vocabulary properties should be explorable
2. **User Control**: No system-imposed study restrictions or recommendations
3. **Flexibility**: Support any combination of filters user might want
4. **Performance**: Fast, responsive filtering and searching
5. **Accessibility**: Keyboard navigation, screen reader support
6. **Mobile Friendly**: Responsive design that works on smaller screens

## Success Metrics

- **Usability**: Users can find desired vocabulary within 30 seconds
- **Flexibility**: Support for complex multi-dimensional filtering
- **Performance**: Sub-200ms filter application on 3000+ vocabulary items
- **Discoverability**: Users naturally discover new filtering combinations
- **Retention**: Users return to use different filter combinations over time
