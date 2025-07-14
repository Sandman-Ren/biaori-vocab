# 標準日本語 Vocabulary Database

🌐 **[Live Demo](https://sandman-ren.github.io/biaori-vocab/)** | [GitHub Repository](https://github.com/Sandman-Ren/biaori-vocab)

A comprehensive Japanese vocabulary learning tool built with Next.js, featuring advanced filtering, sorting, and practice capabilities.

## Features

### 🔍 **Advanced Filtering**
- **Books**: Filter by textbook series (新标初, 新标中, 新标高)
- **Lessons**: Multi-select lesson filtering with search capability
- **Parts of Speech**: Filter by grammatical categories (名词, 动词, 形容词, etc.)
- **Text Search**: Search across Japanese words, readings, meanings, and examples

### 📊 **Interactive Table**
- Sortable columns for all vocabulary properties
- Row selection with bulk actions
- Color-coded part-of-speech badges
- Bookmark functionality for difficult words
- Responsive pagination with configurable page sizes

### 🎯 **Study Features**
- Practice mode for selected vocabulary
- Export functionality for custom study sets
- Persistent bookmarks using localStorage
- Real-time filtering and search

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Build**: Static export for CDN deployment
- **Data**: JSON-based vocabulary database

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
  ]
}
```

## Usage Guide

### Filtering Vocabulary

1. **Books**: Select one or more textbook series to filter vocabulary
2. **Lessons**: Use the search box to find specific lessons, then select desired lessons
3. **Parts of Speech**: Filter by grammatical categories
4. **Text Search**: Enter search terms and choose which fields to search in

### Working with Selections

1. **Individual Selection**: Click checkboxes to select specific vocabulary items
2. **Bulk Selection**: Use "Select All" to select all items on the current page
3. **Practice Mode**: Click "Practice" button to start studying selected items
4. **Export**: Export selected vocabulary as JSON for external use

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
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout with font configuration
│   └── page.tsx             # Main page with vocabulary data loading
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── filter-panel.tsx     # Sidebar filtering interface
│   ├── vocabulary-table.tsx # Main data table component
│   ├── pagination.tsx       # Pagination controls
│   └── vocabulary-database.tsx # Main container component
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── utils.ts             # Utility functions (cn helper)
│   └── vocabulary-utils.ts  # Data processing functions
└── public/
    └── data/
        └── vocabulary.json  # Vocabulary database
```

## Component Architecture

- **VocabularyDatabase**: Main container managing state and data flow
- **FilterPanel**: Sidebar with all filtering options
- **VocabularyTable**: Sortable, selectable data table
- **Pagination**: Page navigation and size controls

## Customization

### Adding New Filters

1. Update the `FilterState` interface in `lib/types.ts`
2. Add filter logic to `filterVocabulary()` in `lib/vocabulary-utils.ts`
3. Add UI controls in `components/filter-panel.tsx`

### Styling

The application uses a neutral, minimalistic design inspired by Vercel's design language:

- **Typography**: Inter font with clean hierarchy
- **Colors**: Monochromatic grays with subtle accents
- **Layout**: Clean spacing and minimal borders
- **Interactive Elements**: Subtle hover and focus states

### Data Updates

To update the vocabulary database:

1. Replace `public/data/vocabulary.json` with new data
2. Ensure the data matches the expected schema
3. Rebuild the application: `npm run build`

## Performance Considerations

- **Static Generation**: All data is processed at build time
- **Client-side Filtering**: Fast, responsive filtering without server requests
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Debounced Search**: 300ms delay for text search input
- **Memoized Computations**: React.useMemo for expensive calculations

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

## Support

For questions or issues, please open an issue on the GitHub repository.
