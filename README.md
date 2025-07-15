# 中日交流标准日本语 - 词汇学习系统

A modernized Japanese vocabulary learning tool built with Next.js, featuring advanced filtering, verb conjugations, and intuitive animations. Specifically designed for Chinese-speaking learners using the 新标准日本语 textbook series.

## ✨ Features

### 🎯 **Localized for Chinese Learners**
- **完全中文界面**: All UI elements translated to Simplified Chinese
- **标准日本语教材**: Designed for 新标准日本语 textbook series
- **中文释义**: Chinese meanings and explanations throughout

### 🔍 **Advanced Filtering & Search**
- **教材筛选**: Filter by textbook series (新标初, 新标中, 新标高)
- **课程筛选**: Multi-select lesson filtering with search capability
- **词性筛选**: Filter by grammatical categories (名词, 动词, 形容词, etc.)
- **动词变位**: Comprehensive verb conjugation filtering and display
- **文本搜索**: Search across Japanese words, readings, meanings, and examples
- **即时交互**: Collapsible filter panel with smooth animations

### 📊 **Interactive Table & Mobile Support**
- **响应式设计**: Fully responsive design optimized for mobile and desktop
- **排序功能**: Sortable columns for all vocabulary properties
- **行选择**: Row selection with bulk actions and smooth animations
- **词性标签**: Color-coded part-of-speech badges
- **收藏功能**: Bookmark functionality for difficult words
- **动画交互**: Smooth spring-based animations for all interactions

### 🎌 **Verb Conjugation System**
- **变位形式**: 15 different conjugation forms (polite, casual, negative, etc.)
- **难度分级**: Beginner (6), Intermediate (10), Advanced (13), Complete (15)
- **展开显示**: Expandable conjugation panels in both desktop and mobile views
- **智能筛选**: Filter by specific conjugation forms
- **中文标注**: All conjugation forms labeled in Chinese

### 📱 **Mobile-First Experience**
- **移动优化**: Mobile-optimized card layout with verb expansion
- **触摸友好**: Touch-friendly controls and gestures
- **移动导出**: Export functionality accessible on mobile
- **浮动按钮**: Floating action button for quick mobile actions
- **格式选择**: Support for CSV, XLSX, JSON, and PDF export formats

### � **Vocabulary Detail Modal**
- **详细信息**: Comprehensive vocabulary details in a responsive modal
- **复制功能**: One-click copy for Japanese words, readings, and meanings
- **收藏管理**: Bookmark vocabulary items directly from the modal
- **例句展示**: Full example sentences with copy functionality
- **课程信息**: Complete lesson and textbook details
- **响应式设计**: Optimized for both mobile and desktop viewing
- **流畅动画**: Smooth open/close animations with spring physics
- **无障碍操作**: Full keyboard navigation and screen reader support
- **音频播放**: Pronunciation playback (planned feature)

### �📄 **Rich PDF Documents**
- **动词练习册**: Generate beautifully formatted verb conjugation practice worksheets  
- **答案册**: Complete answer keys with all conjugation forms
- **离线学习**: Print-ready documents for offline study and repetition practice
- **可定制**: Use selected verbs and conjugation forms for personalized practice
- **专业排版**: HTML/CSS-based generation with perfect Unicode support for Japanese and Chinese characters
- **浏览器打印**: Uses browser's native print functionality for high-quality PDF output

### 🎨 **Modern UI/UX**
- **简约设计**: Clean, minimalistic design inspired by modern standards
- **流畅动画**: Spring-based animations using Framer Motion
- **即时反馈**: Immediate interactivity without blocking animations
- **视觉一致性**: Consistent design language throughout the application
- **模态窗口**: Professional modal dialogs with proper animation lifecycle
- **交互设计**: Intuitive interaction patterns with visual feedback

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with custom styling
- **Animations**: Framer Motion for smooth, spring-based animations
- **Styling**: Tailwind CSS with custom scrollbar and pointer-events utilities
- **Icons**: Lucide React icons
- **Build**: Static export for CDN deployment
- **Data**: JSON-based vocabulary database with verb conjugation support
- **Localization**: Full Simplified Chinese interface
- **Export**: Multiple format support (CSV, XLSX, JSON)
- **PDF Generation**: HTML/CSS-based generation with browser print API for perfect Unicode support
- **Print Ready**: Professional layouts optimized for offline study

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd biaori-vocab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a static export for deployment:

```bash
npm run build
```

The static files will be generated in the `out/` directory and can be deployed to any static hosting service.

## Data Structure

The vocabulary data is stored in `public/data/vocabulary.json` with the following schema:

```json
{
  "book_id": "7",
  "lesson_id": "321", 
  "lesson_name": "新标初_34",
  "japanese_word": "カレンダー",
  "reading": "カレンダー",
  "chinese_meaning": "挂历，日历",
  "part_of_speech": "名词",
  "example_sentences": [
    "卓上カレンダー / 台历。",
    "園芸カレンダー / 农艺全年行事表。"
  ],
  "conjugations": {
    "polite_present": "します",
    "casual_present": "する",
    "polite_past": "しました",
    "casual_past": "した",
    // ... additional conjugation forms for verbs
  }
}
```

### Verb Conjugation System

The application includes a comprehensive verb conjugation system with:

- **15 Conjugation Forms**: From basic present/past to advanced causative/passive forms
- **Difficulty Levels**: 
  - 初级 (Beginner): 6 basic forms
  - 中级 (Intermediate): 10 forms including potential and te-form
  - 高级 (Advanced): 13 forms including causative and passive
  - 全部形式 (Complete): All 15 conjugation forms
- **Chinese Labels**: All conjugation forms are labeled in Simplified Chinese
- **Visual Display**: Expandable conjugation panels showing selected forms

## Usage Guide

### 筛选词汇 (Filtering Vocabulary)

1. **教材**: Select one or more textbook series to filter vocabulary
2. **课程**: Use the search box to find specific lessons, then select desired lessons
3. **词性**: Filter by grammatical categories
4. **动词变位**: Choose conjugation forms and difficulty levels for verb practice
5. **文本搜索**: Enter search terms and choose which fields to search in

### 移动端体验 (Mobile Experience)

1. **触摸操作**: Tap to expand filter panel or verb conjugations
2. **导出功能**: Use the export button in mobile header or floating action button
3. **格式选择**: Choose from CSV, XLSX, or JSON export formats
4. **卡片视图**: Mobile-optimized card layout with expandable verb conjugations

### 动词变位 (Verb Conjugations)

1. **筛选设置**: Use preset difficulty levels or select individual conjugation forms
2. **展开查看**: Click the chevron icon on verb rows to expand conjugation display
3. **移动支持**: Full conjugation support on mobile devices
4. **中文标注**: All conjugation forms displayed with Chinese explanations

### 词汇详情 (Vocabulary Details)

1. **查看详情**: Click the "查看" (View) button in any vocabulary row to open the detail modal
2. **基本信息**: View complete information including Japanese word, reading, and Chinese meaning
3. **复制功能**: Use copy buttons to copy individual elements or all information at once
4. **收藏管理**: Star/unstar vocabulary items directly from the modal
5. **例句学习**: Read through example sentences with one-click copy functionality
6. **课程信息**: See which lesson and textbook the vocabulary belongs to
7. **关闭方式**: Close modal using the X button, ESC key, or clicking outside the modal
8. **键盘导航**: Full keyboard navigation support for accessibility

#### Modal Features:
- **响应式布局**: Automatically adapts to mobile and desktop screen sizes
- **流畅动画**: Smooth open/close animations with spring physics
- **音频播放**: Pronunciation playback button (ready for integration)
- **完整信息**: All available vocabulary data in one organized view
- **无障碍设计**: Screen reader compatible with proper ARIA labels

### Working with Selections

1. **Individual Selection**: Click checkboxes to select specific vocabulary items
2. **Bulk Selection**: Use "全选" to select all items on the current page
3. **Export**: Export selected vocabulary in your preferred format (CSV, XLSX, JSON)
4. **Practice Mode**: Use selected items for focused study sessions

### Bookmarking

- Click the star icon (☆) to bookmark difficult words
- Bookmarks are saved locally and persist between sessions
- Use bookmarks to create custom review sets

### Sorting and Pagination

- Click column headers to sort by that field
- Use the pagination controls to navigate through results
- Adjust page size (25, 50, 100, 200 items) as needed

## Project Structure

```
/
├── app/
│   ├── globals.css              # Global styles, scrollbar utilities, pointer events
│   ├── layout.tsx               # Root layout with Inter font and viewport config
│   └── page.tsx                 # Main page with vocabulary data loading
├── components/
│   ├── ui/                      # shadcn/ui components (enhanced)
│   ├── filter-panel.tsx         # Collapsible sidebar with all filtering options
│   ├── vocabulary-table.tsx     # Animated table with verb expansion and modal integration
│   ├── vocabulary-detail-modal.tsx # Responsive vocabulary detail modal with animations
│   ├── vocabulary-database.tsx  # Main container with mobile FAB and export
│   ├── pagination.tsx           # Pagination controls (localized)
│   └── verb-conjugation-display.tsx # Conjugation display component
├── lib/
│   ├── types.ts                 # TypeScript definitions including VerbConjugations
│   ├── utils.ts                 # Utility functions (cn helper, clsx)
│   ├── vocabulary-utils.ts      # Data processing and filtering functions
│   ├── conjugation-utils.ts     # Verb conjugation logic and forms
│   └── pdf-utils.ts             # PDF generation utilities for practice documents
├── hooks/
│   └── use-mobile.ts            # Mobile detection hook
└── public/
    └── data/
        └── vocabulary.json      # Vocabulary database with conjugation data
```

## Component Architecture

- **VocabularyDatabase**: Main container managing state, mobile detection, and export functionality
- **FilterPanel**: Collapsible sidebar with spring animations and immediate interactivity
- **VocabularyTable**: Responsive table with smooth row animations, verb expansion, and modal integration
- **VocabularyDetailModal**: Responsive modal component with detailed vocabulary information, copy functionality, and smooth animations
- **VerbConjugationDisplay**: Expandable conjugation panels with Chinese labels
- **Pagination**: Localized pagination controls with Chinese text
- **Mobile Support**: FAB, mobile header, and responsive design throughout

## Customization

### Adding New Filters

1. Update the `FilterState` interface in `lib/types.ts`
2. Add filter logic to `filterVocabulary()` in `lib/vocabulary-utils.ts`
3. Add UI controls in `components/filter-panel.tsx`

### Styling & Animation

The application uses a modern, minimalistic design with smooth animations:

- **Typography**: Inter font with clean hierarchy and Chinese character support
- **Colors**: Monochromatic grays with subtle blue accents for interactivity
- **Layout**: Clean spacing, minimal borders, and responsive design
- **Animations**: Spring-based animations using Framer Motion for all interactions
- **Interactive Elements**: Subtle hover states and immediate feedback
- **Mobile-First**: Responsive design optimized for touch interfaces

### Animation System

All animations use consistent spring physics for natural, cohesive motion:

```typescript
// Standard spring configuration
transition={{
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
}}
```

Key animated interactions:
- **Filter Panel**: Collapsible with spring animation and independent scrolling
- **Table Rows**: Smooth layout changes and verb conjugation expansion
- **Mobile Cards**: Layout animations and expandable conjugations
- **Chevron Icons**: Smooth rotation for expand/collapse states
- **Vocabulary Modal**: Smooth open/close animations with backdrop fade and content scaling
- **Modal Backdrop**: Fade in/out with blur effect for focus isolation

#### Modal Animation Lifecycle

The vocabulary detail modal uses a sophisticated animation system:

```typescript
// Modal entrance animation
initial={{ scale: 0.9, opacity: 0, y: 20 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
exit={{ scale: 0.9, opacity: 0, y: 20 }}

// Backdrop animation
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

**Animation Features:**
- **Entrance**: Scales up from 90% with fade-in and slight upward slide
- **Exit**: Smooth reverse animation when closing via any method
- **Backdrop**: Independent fade animation with blur effect
- **Non-blocking**: Page remains interactive during animations
- **Consistent**: Same animation regardless of close method (button, ESC, outside click)
- **Performance**: GPU-accelerated transformations for 60fps animations

### Quick Reference

### Modal Usage
| Action | Method |
|--------|--------|
| Open Modal | Click "查看" button in any vocabulary row |
| Close Modal | X button, ESC key, or click outside modal |
| Copy Text | Click 📋 button next to any text element |
| Copy All | Click "复制全部" button in modal footer |
| Bookmark | Click ⭐ star button in modal header |
| Audio Play | Click "播放发音" button (ready for integration) |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `ESC` | Close open modal |
| `Tab` | Navigate through modal elements |
| `Enter/Space` | Activate focused button |
| `↑/↓` | Scroll modal content (when focused) |

### Part of Speech Colors
| Part of Speech | Color Theme |
|----------------|-------------|
| 名词 (Noun) | 🔵 Blue |
| 动词 (Verb) | 🟢 Green |
| 形容词 (Adjective) | 🟣 Purple |
| 副词 (Adverb) | 🟠 Orange |
| 惯用语 (Idiom) | 🩷 Pink |

## Data Updates

To update the vocabulary database:

1. Replace `public/data/vocabulary.json` with new data
2. Ensure the data matches the expected schema
3. Rebuild the application: `npm run build`

## Performance Considerations

- **Static Generation**: All data is processed at build time for optimal performance
- **Client-side Filtering**: Fast, responsive filtering without server requests
- **Framer Motion Layout**: Efficient layout animations using GPU acceleration
- **Immediate Interactivity**: Animations don't block user interactions
- **Mobile Optimization**: Touch-friendly controls and optimized mobile layouts
- **Smooth Animations**: 60fps spring-based animations for professional feel
- **Memory Efficient**: Proper cleanup of animation instances and event listeners

## Browser Support

- Modern browsers supporting ES2020+
- Chrome, Firefox, Safari, Edge latest versions
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📚 Documentation

For comprehensive documentation, visit the [`/docs`](./docs) folder:

### Quick Links
- **[📖 Complete Documentation Index](./docs/README.md)** - Start here for all documentation
- **[🏗️ System Design](./docs/design/system-design.md)** - Architecture and technical decisions
- **[🔧 API Reference](./docs/api/components-api.md)** - Component and utility API documentation
- **[📊 Data Structure](./docs/data/data-structure.md)** - Vocabulary data format and schema
- **[🔄 Data Lifecycle](./docs/data/data-lifecycle.md)** - Complete data processing pipeline
- **[📋 Reproduction Steps](./docs/data/reproduction-steps.md)** - How to recreate vocabulary.json
- **[🎨 UI Design Guidelines](./docs/design/ui-design.md)** - Design system and component guidelines
- **[⚙️ Animation System](./docs/design/animation-system.md)** - Animation architecture and best practices
- **[📱 Responsive Design](./docs/design/responsive-design.md)** - Mobile and cross-device optimization
- **[🚀 Deployment Guide](./docs/DEPLOYMENT.md)** - Complete deployment instructions
- **[🤝 Contributing](./docs/CONTRIBUTING.md)** - How to contribute to the project
- **[📋 Development Log](./docs/DEVELOPMENT_LOG.md)** - Detailed development history and decisions

### Documentation Highlights
- **Complete data pipeline documentation** from scraping to deployment
- **Comprehensive API reference** for all components and utilities  
- **Design system documentation** with coding standards and best practices
- **Step-by-step reproduction guide** for recreating the vocabulary database
- **Deployment instructions** for multiple platforms (Vercel, Netlify, self-hosted)
- **Architecture decisions** and technical design rationale

## Support

For questions or issues, please open an issue on the GitHub repository.

## 动词练习册生成 (PDF Practice Documents)

The application now includes a sophisticated PDF generation system for creating rich, formatted verb conjugation practice documents:

1. **选择动词**: Filter and select verbs using the table checkbox selection
2. **选择变位形式**: Configure which conjugation forms to include in the practice document
3. **选择导出格式**:
   - **PDF练习册**: Generates a worksheet with blank spaces for practice (opens print dialog)
   - **PDF答案册**: Generates a complete answer key with all conjugations (opens print dialog)
4. **打印为PDF**: Use browser's "Save as PDF" option in the print dialog to create downloadable documents

#### PDF Document Features
- **Professional Layout**: Clean typography optimized for Japanese and Chinese text
- **Difficulty Indicators**: Each conjugation form labeled with difficulty level (基础/中级/高级)
- **Example Sentences**: Includes usage examples for context
- **Practice Spaces**: Blank lines for handwriting practice (practice version)
- **Complete Answers**: Full conjugation answers (answer key version)
- **Page Numbers**: Multi-page documents with proper pagination
- **Study Instructions**: Helpful tips and usage guidelines

#### Usage Workflow
```
1. 筛选动词 → Filter verbs by textbook, lesson, or search
2. 选择词汇 → Select specific verbs using checkboxes
3. 配置变位 → Choose conjugation forms and difficulty level
4. 选择格式 → Select "PDF练习" or "PDF答案" from export dropdown
5. 生成文档 → Click export to generate and download PDF
```
