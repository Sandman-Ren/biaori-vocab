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
  conjugations?: ConjugationSourceMap;
}

export interface VerbConjugations {
  polite_present: string;      // します
  polite_past: string;         // しました  
  polite_negative: string;     // しません
  polite_past_negative: string; // しませんでした
  casual_present: string;      // する
  casual_past: string;         // した
  casual_negative: string;     // しない
  casual_past_negative: string; // しなかった
  te_form: string;             // して
  potential: string;           // できる
  passive: string;             // される
  causative: string;           // させる
  imperative: string;          // しろ
  conditional: string;         // すれば
  volitional: string;          // しよう
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
  selectedConjugations: (keyof VerbConjugations)[];
  conjugationSource: ConjugationSource;
}

export type ConjugationLevel = 'beginner' | 'intermediate' | 'advanced' | 'complete' | 'custom';

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

// Conjugation source types
export type ConjugationSource = 'precomputed' | 'jmdict';

export interface ConjugationSourceMap {
  precomputed?: VerbConjugations;
  jmdict?: VerbConjugations;
}

// Utility function to get conjugations from a specific source
export function getConjugationsFromSource(
  conjugationMap: ConjugationSourceMap | undefined,
  source: ConjugationSource
): VerbConjugations | undefined {
  return conjugationMap?.[source];
}

// Utility function to get the best available conjugations (with fallback)
export function getBestConjugations(
  conjugationMap: ConjugationSourceMap | undefined,
  preferredSource: ConjugationSource = 'precomputed'
): VerbConjugations | undefined {
  if (!conjugationMap) return undefined;
  
  // Try preferred source first
  if (conjugationMap[preferredSource]) {
    return conjugationMap[preferredSource];
  }
  
  // Fallback to precomputed first, then jmdict
  return conjugationMap.precomputed || conjugationMap.jmdict;
}
