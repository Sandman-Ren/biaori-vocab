import { VocabularyItem, BookInfo, LessonInfo, PartOfSpeechInfo } from './types';

export function getBookInfo(vocabulary: VocabularyItem[]): BookInfo[] {
  const bookCounts = new Map<string, { name: string; count: number }>();
  
  vocabulary.forEach(item => {
    const key = item.book_id;
    const existing = bookCounts.get(key);
    const bookName = getBookName(item.book_id);
    
    if (existing) {
      existing.count++;
    } else {
      bookCounts.set(key, { name: bookName, count: 1 });
    }
  });
  
  return Array.from(bookCounts.entries()).map(([id, info]) => ({
    id,
    name: info.name,
    count: info.count
  }));
}

export function getLessonInfo(vocabulary: VocabularyItem[]): LessonInfo[] {
  const lessonCounts = new Map<string, number>();
  
  vocabulary.forEach(item => {
    const key = item.lesson_name;
    lessonCounts.set(key, (lessonCounts.get(key) || 0) + 1);
  });
  
  return Array.from(lessonCounts.entries())
    .map(([name, count]) => ({ id: name, name, count }))
    .sort((a, b) => b.name.localeCompare(a.name)); // Sort by lesson name descending
}

export function getPartOfSpeechInfo(vocabulary: VocabularyItem[]): PartOfSpeechInfo[] {
  const posCounts = new Map<string, number>();
  
  vocabulary.forEach(item => {
    const pos = item.part_of_speech;
    posCounts.set(pos, (posCounts.get(pos) || 0) + 1);
  });
  
  // Semantic ordering for Japanese parts of speech (based on actual data)
  const semanticOrder = [
    // Core content words (lexical categories) - most fundamental
    '名词',          // Nouns - fundamental building blocks (689 items)
    '动1',           // Godan verbs (Group 1) (105 items)
    '动2',           // Ichidan verbs (Group 2) (50 items)
    '动3',           // Irregular verbs (Group 3) (65 items)
    '形容动词',      // Na-adjectives (adjectival nouns) (52 items)
    '副词',          // Adverbs - modifying words (70 items)
    
    // Functional words (grammatical categories)
    '代词',          // Pronouns (487 items)
    '接续词',        // Conjunctive words (12 items)
    '连接词',        // Connecting words (8 items)
    '感叹词',        // Interjections (19 items)
    
    // Special categories and expressions
    '惯用语',        // Idioms and set phrases (77 items)
    '专有词',        // Proper nouns/specialized terms (97 items)
    
    // Additional categories that might exist
    '形容词',        // I-adjectives
    '助词',          // Particles
    '助动词',        // Auxiliary verbs
    '数词',          // Numerals
    '连体词',        // Prenominal adjectives
    '接头词',        // Prefixes
    '接尾词',        // Suffixes
    '外来语',        // Loanwords
    '敬语',          // Honorific language
    '复合词',        // Compound words
    '略语',          // Abbreviations
  ];
  
  const getSemanticOrder = (pos: string): number => {
    const index = semanticOrder.indexOf(pos);
    return index !== -1 ? index : semanticOrder.length; // Unknown POS go to the end
  };
  
  return Array.from(posCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const orderA = getSemanticOrder(a.name);
      const orderB = getSemanticOrder(b.name);
      
      // Primary sort: semantic order
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Secondary sort: by count (descending) for same semantic group
      return b.count - a.count;
    });
}

export function getBookName(bookId: string): string {
  const bookNames: Record<string, string> = {
    '7': '新标初',
    '8': '新标中', 
    '9': '新标高'
  };
  return bookNames[bookId] || `Book ${bookId}`;
}

export function getPartOfSpeechColor(partOfSpeech: string): string {
  const colorMap: Record<string, string> = {
    '名词': 'bg-slate-50 text-slate-700 border-slate-200',
    '动词': 'bg-gray-50 text-gray-700 border-gray-200',
    '形容词': 'bg-zinc-50 text-zinc-700 border-zinc-200',
    '惯用语': 'bg-neutral-50 text-neutral-700 border-neutral-200',
    '副词': 'bg-stone-50 text-stone-700 border-stone-200',
  };
  return colorMap[partOfSpeech] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export function filterVocabulary(
  vocabulary: VocabularyItem[],
  filters: {
    books: string[];
    lessons: string[];
    partsOfSpeech: string[];
    textSearch: string;
    searchFields: string[];
  }
): VocabularyItem[] {
  return vocabulary.filter(item => {
    // Book filter
    if (filters.books.length > 0 && !filters.books.includes(item.book_id)) {
      return false;
    }
    
    // Lesson filter
    if (filters.lessons.length > 0 && !filters.lessons.includes(item.lesson_name)) {
      return false;
    }
    
    // Part of speech filter
    if (filters.partsOfSpeech.length > 0 && !filters.partsOfSpeech.includes(item.part_of_speech)) {
      return false;
    }
    
    // Text search
    if (filters.textSearch.trim()) {
      const searchTerm = filters.textSearch.toLowerCase();
      const searchableFields: Record<string, string> = {
        'japanese': item.japanese_word,
        'reading': item.reading,
        'meaning': item.chinese_meaning,
        'examples': item.example_sentences.join(' ')
      };
      
      const fieldsToSearch = filters.searchFields.length > 0 
        ? filters.searchFields 
        : ['japanese', 'reading', 'meaning'];
      
      const matchesSearch = fieldsToSearch.some(field => 
        searchableFields[field]?.toLowerCase().includes(searchTerm)
      );
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
}

export function sortVocabulary(
  vocabulary: VocabularyItem[],
  sortColumn: string,
  sortDirection: 'asc' | 'desc'
): VocabularyItem[] {
  return [...vocabulary].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortColumn) {
      case 'japanese':
        aValue = a.japanese_word;
        bValue = b.japanese_word;
        break;
      case 'reading':
        aValue = a.reading;
        bValue = b.reading;
        break;
      case 'meaning':
        aValue = a.chinese_meaning;
        bValue = b.chinese_meaning;
        break;
      case 'part_of_speech':
        aValue = a.part_of_speech;
        bValue = b.part_of_speech;
        break;
      case 'lesson':
        aValue = a.lesson_name;
        bValue = b.lesson_name;
        break;
      case 'examples':
        aValue = a.example_sentences.length;
        bValue = b.example_sentences.length;
        break;
      default:
        aValue = a.japanese_word;
        bValue = b.japanese_word;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = (aValue as number) - (bValue as number);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });
}

export function paginateVocabulary(
  vocabulary: VocabularyItem[],
  currentPage: number,
  pageSize: number
): VocabularyItem[] {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return vocabulary.slice(startIndex, endIndex);
}
