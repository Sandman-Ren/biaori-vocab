import { VerbConjugations, ConjugationLevel } from './types';

export interface ConjugationForm {
  key: keyof VerbConjugations;
  label: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
}

export const CONJUGATION_FORMS: ConjugationForm[] = [
  // Basic forms (Beginner level)
  { key: 'polite_present', label: '现在时（敬语）', description: 'ます形', category: 'basic' },
  { key: 'casual_present', label: '现在时（简体）', description: '辞书形', category: 'basic' },
  { key: 'polite_past', label: '过去时（敬语）', description: 'ました形', category: 'basic' },
  { key: 'casual_past', label: '过去时（简体）', description: 'た形', category: 'basic' },
  { key: 'polite_negative', label: '否定（敬语）', description: 'ません形', category: 'basic' },
  { key: 'casual_negative', label: '否定（简体）', description: 'ない形', category: 'basic' },
  
  // Intermediate forms
  { key: 'polite_past_negative', label: '过去否定（敬语）', description: 'ませんでした形', category: 'intermediate' },
  { key: 'casual_past_negative', label: '过去否定（简体）', description: 'なかった形', category: 'intermediate' },
  { key: 'te_form', label: 'Te形', description: '连接形', category: 'intermediate' },
  { key: 'potential', label: '可能形', description: '能够...', category: 'intermediate' },
  
  // Advanced forms
  { key: 'passive', label: '被动形', description: '被...', category: 'advanced' },
  { key: 'causative', label: '使役形', description: '让/使某人...', category: 'advanced' },
  { key: 'imperative', label: '命令形', description: '命令形', category: 'advanced' },
  { key: 'conditional', label: '条件形', description: '如果/当...', category: 'advanced' },
  { key: 'volitional', label: '意志形', description: '我们...吧', category: 'advanced' },
];

export function getConjugationsByLevel(level: ConjugationLevel): (keyof VerbConjugations)[] {
  switch (level) {
    case 'beginner':
      return CONJUGATION_FORMS.filter(form => form.category === 'basic').map(form => form.key);
    case 'intermediate':
      return CONJUGATION_FORMS.filter(form => form.category === 'basic' || form.category === 'intermediate').map(form => form.key);
    case 'advanced':
      return CONJUGATION_FORMS.filter(form => form.category !== 'advanced').concat(
        CONJUGATION_FORMS.filter(form => form.category === 'advanced').slice(0, 3)
      ).map(form => form.key);
    case 'complete':
      return CONJUGATION_FORMS.map(form => form.key);
    case 'custom':
      return []; // For custom, we don't apply any preset
    default:
      return CONJUGATION_FORMS.filter(form => form.category === 'basic').map(form => form.key);
  }
}

export function detectCurrentLevel(selectedConjugations: (keyof VerbConjugations)[]): ConjugationLevel {
  if (!selectedConjugations || selectedConjugations.length === 0) {
    return 'custom';
  }
  
  const beginnerForms = getConjugationsByLevel('beginner');
  const intermediateForms = getConjugationsByLevel('intermediate');
  const advancedForms = getConjugationsByLevel('advanced');
  const completeForms = getConjugationsByLevel('complete');

  const arraysEqual = (a: (keyof VerbConjugations)[], b: (keyof VerbConjugations)[]) => 
    a && b && a.length === b.length && a.every(item => b.includes(item));

  if (arraysEqual(selectedConjugations, completeForms)) return 'complete';
  if (arraysEqual(selectedConjugations, advancedForms)) return 'advanced';
  if (arraysEqual(selectedConjugations, intermediateForms)) return 'intermediate';
  if (arraysEqual(selectedConjugations, beginnerForms)) return 'beginner';
  return 'custom';
}

export function isVerb(partOfSpeech: string): boolean {
  return partOfSpeech === '动1' || partOfSpeech === '动2' || partOfSpeech === '动3';
}

export function getVerbGroup(partOfSpeech: string): '1' | '2' | '3' | null {
  if (partOfSpeech === '动1') return '1';
  if (partOfSpeech === '动2') return '2'; 
  if (partOfSpeech === '动3') return '3';
  return null;
}

// Sample conjugation data for demonstration - in a real app, this would come from the vocabulary.json
export function generateSampleConjugations(word: string, group: '1' | '2' | '3'): VerbConjugations {
  // This is a simplified example - real conjugation would need proper linguistic rules
  const stem = word.replace(/ます$/, '');
  
  if (group === '1') {
    // Group 1 verbs (五段動詞)
    return {
      polite_present: word,
      polite_past: stem + 'ました',
      polite_negative: stem + 'ません',
      polite_past_negative: stem + 'ませんでした',
      casual_present: stem + 'る', // This is simplified
      casual_past: stem + 'った', // This is simplified
      casual_negative: stem + 'らない', // This is simplified
      casual_past_negative: stem + 'らなかった', // This is simplified
      te_form: stem + 'って', // This is simplified
      potential: stem + 'れる', // This is simplified
      passive: stem + 'れる', // This is simplified
      causative: stem + 'せる', // This is simplified
      imperative: stem + 'れ', // This is simplified
      conditional: stem + 'れば', // This is simplified
      volitional: stem + 'ろう', // This is simplified
    };
  } else if (group === '2') {
    // Group 2 verbs (一段動詞)
    return {
      polite_present: word,
      polite_past: stem + 'ました',
      polite_negative: stem + 'ません',
      polite_past_negative: stem + 'ませんでした',
      casual_present: stem + 'る',
      casual_past: stem + 'た',
      casual_negative: stem + 'ない',
      casual_past_negative: stem + 'なかった',
      te_form: stem + 'て',
      potential: stem + 'られる',
      passive: stem + 'られる',
      causative: stem + 'させる',
      imperative: stem + 'ろ',
      conditional: stem + 'れば',
      volitional: stem + 'よう',
    };
  } else {
    // Group 3 verbs (不規則動詞) - would need specific handling
    return {
      polite_present: word,
      polite_past: stem + 'ました',
      polite_negative: stem + 'ません',
      polite_past_negative: stem + 'ませんでした',
      casual_present: 'する', // Placeholder
      casual_past: 'した', // Placeholder
      casual_negative: 'しない', // Placeholder
      casual_past_negative: 'しなかった', // Placeholder
      te_form: 'して', // Placeholder
      potential: 'できる', // Placeholder
      passive: 'される', // Placeholder
      causative: 'させる', // Placeholder
      imperative: 'しろ', // Placeholder
      conditional: 'すれば', // Placeholder
      volitional: 'しよう', // Placeholder
    };
  }
}
