# 標準日本語 Vocabulary Database - Design Document

## Overview

A table-centric vocabulary browsing application for Japanese language learners. The primary focus is on flexible data exploration and filtering, allowing users to manually curate their own study sets from the comprehensive vocabulary database.

## Core Philosophy

- **Data-driven exploration**: Users can filter and search vocabulary based on any content property
- **Manual curation**: Users build their own study sets by selecting specific lessons, word types, etc.
- **Non-prescriptive**: No assumptions about learning pace or study order
- **Maximum flexibility**: Support for complex, multi-dimensional filtering

## Data Structure

### Vocabulary Properties (Filterable)
```json
{
  "book_id": "7",                    // Textbook series identifier
  "lesson_id": "321",               // Unique lesson identifier  
  "lesson_name": "新标初_34",        // Human-readable lesson name
  "japanese_word": "カレンダー",      // Japanese vocabulary word
  "reading": "カレンダー",           // Pronunciation/reading
  "chinese_meaning": "挂历，日历",    // Chinese translation
  "part_of_speech": "名词",          // Grammatical category
  "example_sentences": [            // Usage examples with translations
    "卓上カレンダー / 台历。",
    "園芸カレンダー / 农艺全年行事表。"
  ]
}
```

### Metadata Properties (Non-filterable)
- `lesson_url`: Source URL for the lesson
- `word_number`: Position within lesson
- `pronunciation_url`: Audio file reference (typically null)
- `page_url`: Source page URL
- `scraped_at`: Data collection timestamp

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Title + Word Count + Actions                           │
├─────────────────┬───────────────────────────────────────────────┤
│                 │                                               │
│ Filter Panel    │ Main Table                                   │
│ (Sidebar)       │ - Sortable columns                           │
│                 │ - Selectable rows                            │
│ - Books         │ - Pagination                                 │
│ - Lessons       │                                               │
│ - Parts of      │                                               │
│   Speech        │                                               │
│ - Text Search   │                                               │
│                 │                                               │
└─────────────────┴───────────────────────────────────────────────┘
```

### Filter Panel Components

#### 1. Books Filter
```
📚 Books
☐ Book 7 (新标初) - 1,247 words
☐ Book 8 (新标中) - 892 words  
☐ Book 9 (新标高) - 692 words
```

#### 2. Lessons Filter (Multi-select with search)
```
📖 Lessons
[Search lessons...                    ]
☐ 新标初_34 (23 words)
☐ 新标初_33 (24 words)
☐ 新标初_32 (25 words)
☐ 新标初_31 (19 words)
[Show more...]
```

#### 3. Parts of Speech Filter
```
🏷️ Parts of Speech
☐ 名词 (Noun) - 1,247 words
☐ 动词 (Verb) - 523 words
☐ 形容词 (Adjective) - 234 words
☐ 惯用语 (Idiom) - 156 words
☐ 副词 (Adverb) - 89 words
```

#### 4. Text Search
```
🔍 Text Search
[Search Japanese, Reading, Chinese...]

Advanced Options:
☐ Japanese word
☐ Reading
☐ Chinese meaning
☐ Example sentences
```

### Main Table Structure

| Column | Content | Sortable | Description |
|--------|---------|----------|-------------|
| Select | Checkbox | No | Row selection for batch actions |
| Japanese | japanese_word | Yes | Primary vocabulary word |
| Reading | reading | Yes | Pronunciation guide |
| Chinese | chinese_meaning | Yes | Translation |
| Part of Speech | part_of_speech | Yes | Grammatical category with color coding |
| Lesson | lesson_name | Yes | Source lesson |
| Examples | example_sentences.length | Yes | Number of example sentences |
| Actions | Buttons | No | View details, practice, bookmark |

### Table Features

#### Sorting
- Click any column header to sort
- Support for ascending/descending order
- Visual indicators for current sort column and direction

#### Row Selection
- Individual row checkboxes
- "Select All" functionality with current filter
- Batch actions for selected rows

#### Pagination
- Configurable page size (25, 50, 100, 200 rows)
- Page navigation with first/previous/next/last
- Jump to specific page
- Total results display

### Color Coding System

#### Parts of Speech
- 🟢 **名词 (Noun)**: Green badge
- 🔵 **动词 (Verb)**: Blue badge  
- 🟡 **形容词 (Adjective)**: Yellow badge
- 🟣 **惯用语 (Idiom)**: Purple badge
- 🟠 **副词 (Adverb)**: Orange badge

#### Row States
- **Default**: White background
- **Hover**: Light gray background
- **Selected**: Light blue background
- **Bookmarked**: Star icon in row

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
