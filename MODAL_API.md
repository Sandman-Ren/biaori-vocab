# Vocabulary Detail Modal - API Documentation

## Component Overview

The `VocabularyDetailModal` is a responsive, animated modal component that displays comprehensive vocabulary information with copy functionality, bookmark support, and smooth animations.

## Props Interface

```typescript
interface VocabularyDetailModalProps {
  isOpen: boolean;           // Controls modal visibility
  onClose: () => void;       // Callback when modal should close
  vocabulary: VocabularyItem; // Vocabulary data to display
  isBookmarked: boolean;     // Whether item is bookmarked
  onBookmark: (id: string) => void; // Bookmark toggle callback
}
```

## Usage Example

```tsx
import VocabularyDetailModal from '@/components/vocabulary-detail-modal';
import { AnimatePresence } from 'framer-motion';

function VocabularyTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState<VocabularyItem | null>(null);
  const [bookmarkedRows, setBookmarkedRows] = useState<string[]>([]);

  const handleViewDetails = (item: VocabularyItem) => {
    setSelectedVocabulary(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVocabulary(null);
  };

  const handleBookmark = (id: string) => {
    setBookmarkedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {/* Table content */}
      
      {/* Modal with AnimatePresence for animations */}
      <AnimatePresence mode="wait">
        {isModalOpen && selectedVocabulary && (
          <VocabularyDetailModal 
            key={selectedVocabulary._id}
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            vocabulary={selectedVocabulary}
            isBookmarked={bookmarkedRows.includes(selectedVocabulary._id)}
            onBookmark={handleBookmark}
          />
        )}
      </AnimatePresence>
    </>
  );
}
```

## Component Features

### Core Functionality
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Copy to Clipboard**: Copy buttons for individual elements and full vocabulary data
- **Bookmark Management**: Star/unstar vocabulary items
- **Example Sentences**: Display and copy functionality for all example sentences
- **Course Information**: Show lesson name, book ID, and other metadata

### Animation System
- **Entrance Animation**: Scale up from 90% with fade-in and upward slide
- **Exit Animation**: Reverse entrance animation
- **Backdrop Animation**: Independent fade with blur effect
- **Spring Physics**: Natural, bouncy animations using Framer Motion

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support with tab order
- **ESC Key**: Close modal with Escape key
- **Focus Management**: Proper focus trapping and restoration
- **Screen Reader**: Compatible with assistive technologies
- **ARIA Labels**: Proper semantic structure

### Responsive Behavior

#### Mobile Layout
```tsx
// Mobile footer - stacked buttons
<div className="flex flex-col gap-3 sm:hidden w-full max-w-sm">
  <Button variant="outline" className="w-full justify-center">
    <Copy className="w-4 h-4 mr-2" />
    复制全部
  </Button>
  <Button variant="outline" className="w-full justify-center">
    <Volume2 className="w-4 h-4 mr-2" />
    播放发音
  </Button>
  <Button onClick={onClose} className="w-full justify-center">
    关闭
  </Button>
</div>
```

#### Desktop Layout
```tsx
// Desktop footer - horizontal layout
<div className="hidden sm:flex sm:w-full sm:justify-between sm:items-center">
  <div className="modal-actions flex gap-3 items-center">
    {/* Action buttons */}
  </div>
  <Button onClick={onClose}>关闭</Button>
</div>
```

## Animation Configuration

### Overlay Animation
```typescript
{
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}
```

### Content Animation
```typescript
{
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 20 },
  transition: { 
    type: "spring", 
    stiffness: 300, 
    damping: 30,
    duration: 0.3
  }
}
```

## CSS Classes

### Modal Structure Classes
```css
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8 bg-black/50 backdrop-blur-sm;
}

.modal-content {
  @apply relative w-full max-w-2xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] min-h-[300px] bg-white shadow-2xl outline-none flex flex-col;
}

.modal-rounded {
  @apply rounded-xl;
}

.modal-scroll {
  @apply flex-1 overflow-y-auto min-h-0;
}

.modal-footer {
  @apply flex flex-col sm:flex-row gap-3 px-6 py-4 sm:px-8 sm:py-5 border-t bg-gray-50 flex-shrink-0 items-center;
}

.modal-actions {
  @apply flex gap-3 items-center;
}
```

## Event Handlers

### Close Modal Methods
The modal can be closed through multiple methods:

1. **Close Button**: Header and footer close buttons
2. **ESC Key**: Keyboard escape key
3. **Backdrop Click**: Clicking outside the modal content
4. **Programmatic**: Calling the `onClose` prop function

### Copy Functionality
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('已复制到剪贴板', { duration: 2000 });
  }).catch(() => {
    toast.error('复制失败', { duration: 2000 });
  });
};
```

### Bookmark Handler
```typescript
const handleBookmarkClick = () => {
  onBookmark(vocabulary._id);
};
```

## Content Sections

### 1. Header Section
- Modal title: "词汇详情"
- Part of speech badge with color coding
- Bookmark star button
- Close button

### 2. Basic Information Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>基本信息</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Japanese word with copy button */}
    {/* Reading with copy button */}
    {/* Chinese meaning with copy button */}
  </CardContent>
</Card>
```

### 3. Course Information Card
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <BookOpen className="w-5 h-5" />
      <span>课程信息</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Lesson name and book ID */}
  </CardContent>
</Card>
```

### 4. Example Sentences Card (Conditional)
```tsx
{vocabulary.example_sentences && vocabulary.example_sentences.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5" />
          <span>例句</span>
        </div>
        <Badge variant="secondary">
          {vocabulary.example_sentences.length} 个
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {/* Example sentences with copy buttons */}
    </CardContent>
  </Card>
)}
```

### 5. Additional Information Card
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Clock className="w-5 h-5" />
      <span>其他信息</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Grid layout with metadata */}
  </CardContent>
</Card>
```

## Part of Speech Color Coding

```typescript
const getPartOfSpeechColor = (partOfSpeech: string) => {
  switch (partOfSpeech.toLowerCase()) {
    case '名词':
    case 'noun':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case '动词':
    case 'verb':
      return 'bg-green-50 text-green-700 border-green-200';
    case '形容词':
    case 'adjective':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case '副词':
    case 'adverb':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case '惯用语':
    case 'idiom':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};
```

## Performance Considerations

### Optimization Strategies
1. **Lazy Mounting**: Modal only renders when needed
2. **Efficient Re-renders**: Proper dependency arrays in useEffect
3. **GPU Acceleration**: Transform-based animations
4. **Event Cleanup**: Proper cleanup of event listeners
5. **Focus Management**: Efficient focus trapping

### Memory Management
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalRef.current?.focus(), 100);
  }

  return () => {
    document.body.style.overflow = 'unset';
    // Cleanup happens automatically
  };
}, [isOpen]);
```

## Error Handling

### Copy Functionality Error Handling
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('已复制到剪贴板', { duration: 2000 });
    })
    .catch(() => {
      toast.error('复制失败', { duration: 2000 });
    });
};
```

### Graceful Degradation
- Copy buttons fall back to text selection if Clipboard API unavailable
- Animations degrade gracefully on older browsers
- Touch events work alongside mouse events

## Browser Support

### Minimum Requirements
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Feature Support
- ✅ Clipboard API
- ✅ CSS Grid and Flexbox
- ✅ CSS Transforms
- ✅ Touch Events
- ✅ Keyboard Events
- ✅ Focus Management

## Testing Considerations

### Test Cases
1. **Rendering**: Modal renders with correct content
2. **Interactions**: All buttons and click handlers work
3. **Animations**: Entrance and exit animations play correctly
4. **Responsive**: Layout adapts to different screen sizes
5. **Accessibility**: Keyboard navigation and screen readers work
6. **Error Handling**: Copy failures are handled gracefully

### Example Test Structure
```typescript
describe('VocabularyDetailModal', () => {
  it('renders vocabulary information correctly', () => {
    // Test content rendering
  });

  it('handles close events from multiple sources', () => {
    // Test ESC key, backdrop click, button click
  });

  it('copies text to clipboard when copy buttons are clicked', () => {
    // Test copy functionality
  });

  it('adapts layout for mobile and desktop', () => {
    // Test responsive behavior
  });
});
```

This comprehensive API documentation provides all the information needed to understand, implement, maintain, and extend the Vocabulary Detail Modal component.
