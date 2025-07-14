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
├── JSON格式 (.json)
├── PDF练习册 - 动词变位练习
└── PDF答案册 - 动词变位答案
```

#### Mobile Export Options
1. **头部导出按钮**: Modal选择格式
2. **浮动操作按钮**: 
   ```
   [+] ──┬── 📁 导出选中
         ├── 📊 练习模式  
         └── 🎯 快速操作
   ```

#### PDF Export Features
- **Rich Formatting**: Professional layouts with proper typography
- **Japanese Font Support**: Optimized for Japanese characters and conjugations
- **Chinese Explanations**: All conjugation forms labeled in Simplified Chinese
- **Practice Mode**: Blank worksheets for handwriting practice
- **Answer Keys**: Complete conjugation references
- **Multi-page Support**: Automatic pagination for large verb sets
- **Print Optimization**: A4 format with proper margins and spacing

#### PDF Export Workflows
- **单词练习册导出**:
  1. 用户选择多个动词
  2. 点击导出按钮，选择“PDF练习册”
  3. 系统生成包含所选动词的练习册PDF
  4. 用户下载或打印PDF进行书写练习

- **答案册导出**:
  1. 用户在练习后需要检查答案
  2. 点击导出按钮，选择“PDF答案册”
  3. 系统生成包含所选动词变位答案的PDF
  4. 用户下载或打印PDF进行对照检查

### PDF Generation System
```typescript
interface PDFGenerationOptions {
  selectedVocabulary: VocabularyItem[];
  selectedConjugations: (keyof VerbConjugations)[];
  includeExamples?: boolean;
  includeAnswers?: boolean;
}

// Main PDF generation functions
function generateVerbConjugationWorksheet(options): void; // Practice version
function generateVerbConjugationAnswerKey(options): void;  // Answer version
```

### PDF Document Structure
```
┌─────────────────────────────────────────────┐
│ 动词变位练习册                              │
│ 共 X 个动词 | Y 种变位形式                  │
│ 生成时间: YYYY-MM-DD                        │
├─────────────────────────────────────────────┤
│ 难度等级: 基础 | 中级 | 高级                │
├─────────────────────────────────────────────┤
│                                             │
│ 1. 動詞 (どうし)                            │
│    读音: どうし                             │
│    含义: 动词                               │
│    课程: 新标初_XX                          │
│                                             │
│    变位形式              难度    答案       │
│    ─────────────────────────────────────    │
│    • 现在时（敬语）      [基础]  ______     │
│    • 现在时（简体）      [基础]  ______     │
│    • 过去时（敬语）      [基础]  ______     │
│                                             │
│    例句:                                    │
│    • 例句内容...                            │
│                                             │
└─────────────────────────────────────────────┘
```

## Features for Future Implementation

### Advanced PDF Features
- **Custom Templates**: Multiple PDF layout options and themes
- **Font Selection**: Support for different Japanese fonts (mincho, gothic)
- **Practice Modes**: Fill-in-the-blank, multiple choice, translation exercises
- **Progress Tracking**: QR codes linking to digital progress tracking
- **Batch Generation**: Generate practice sets for entire lessons or textbooks

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

## User Scenarios

### Scenario 1: 新用户初次使用
```
1. 用户下载并安装应用
2. 首次打开应用，看到欢迎界面和使用说明
3. 进入主界面，看到中日交流标准日本语的标题和词汇统计
4. 点击“开始学习”按钮，进入词汇学习界面
```

### Scenario 2: 词汇筛选与学习
```
1. 用户在主界面选择“词汇学习”
2. 进入词汇学习界面，看到默认加载的词汇列表
3. 用户点击“筛选”按钮，打开筛选面板
4. 在筛选面板中，用户选择“新标初”教材和“名词”词性
5. 用户点击“应用筛选”按钮，词汇列表更新为符合条件的词汇
6. 用户点击某个词汇，查看词汇详情和例句
```

### Scenario 3: 动词变位学习
```
1. 用户在词汇列表中选择一个动词词汇
2. 点击“动词变位”标签，查看该动词的所有变位形式
3. 用户选择“高级形式”，查看该动词的被动形和使役形
4. 用户点击“返回”按钮，回到词汇详情页
```

### Scenario 4: 导出词汇数据
```
1. 用户在词汇学习界面，点击右上角的“导出”按钮
2. 选择导出格式为“CSV格式”
3. 点击“导出当前词汇”选项
4. 系统生成CSV文件并提供下载链接
```

### Scenario 5: Generate Practice Documents
```
1. User wants to create offline study materials for specific verbs
2. Filter verbs by lesson or difficulty level
3. Select target verbs using table checkboxes
4. Configure conjugation forms (use preset levels or individual selection)
5. Choose export format:
   - PDF练习册: For handwriting practice with blank spaces
   - PDF答案册: For reference with complete answers
6. Download professionally formatted PDF document
7. Print for offline study and repetition practice
```
