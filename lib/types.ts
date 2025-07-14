export interface VocabularyItem {
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
}

export interface FilterState {
  books: string[];
  lessons: string[];
  partsOfSpeech: string[];
  textSearch: string;
  searchFields: string[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  selectedRows: string[];
  currentPage: number;
  pageSize: number;
}

export interface BookInfo {
  id: string;
  name: string;
  count: number;
}

export interface LessonInfo {
  id: string;
  name: string;
  count: number;
}

export interface PartOfSpeechInfo {
  name: string;
  count: number;
}
