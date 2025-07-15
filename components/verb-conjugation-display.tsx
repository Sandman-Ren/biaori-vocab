'use client';

import { VocabularyItem, VerbConjugations, ConjugationSource, getBestConjugations } from '@/lib/types';
import { CONJUGATION_FORMS, generateSampleConjugations, getVerbGroup, ConjugationForm } from '@/lib/conjugation-utils';
import { Badge } from '@/components/ui/badge';

interface VerbConjugationDisplayProps {
  vocabulary: VocabularyItem;
  selectedConjugations: (keyof VerbConjugations)[];
  conjugationSource?: ConjugationSource;
}

export default function VerbConjugationDisplay({ 
  vocabulary, 
  selectedConjugations,
  conjugationSource = 'precomputed' 
}: VerbConjugationDisplayProps) {
  const verbGroup = getVerbGroup(vocabulary.part_of_speech);
  
  if (!verbGroup) {
    return null;
  }

  // Get conjugations from the selected source, with fallback to generated ones
  const conjugations = getBestConjugations(vocabulary.conjugations, conjugationSource) || 
    generateSampleConjugations(vocabulary.japanese_word, verbGroup);
  
  const formsToShow = CONJUGATION_FORMS.filter(form => 
    selectedConjugations.includes(form.key)
  );

  if (formsToShow.length === 0) {
    return (
      <div className="bg-gray-50 border-t p-4 text-center">
        <span className="text-sm text-gray-500">
          未选择动词变位形式。请在筛选面板中选择要显示的形式。
        </span>
      </div>
    );
  }

  const renderConjugationRow = (form: ConjugationForm) => {
    const conjugatedForm = conjugations[form.key];
    if (!conjugatedForm) return null;

    return (
      <div 
        key={form.key}
        className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 border-l-2 border-gray-200"
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="text-sm font-medium text-gray-700 min-w-[120px]">
            {form.label}
          </div>
          <div className="text-base font-medium text-gray-900">
            {conjugatedForm}
          </div>
          <Badge variant="outline" className="text-xs text-gray-500">
            {form.description}
          </Badge>
        </div>
        <div className="text-xs text-gray-400">
          {form.category === 'basic' ? '基础' : form.category === 'intermediate' ? '中级' : '高级'}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border-t">
      <div className="px-4 py-2 bg-gray-100 border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            动词变位 ({formsToShow.length} 个形式)
          </span>
          <Badge variant="outline" className="text-xs">
            {verbGroup}类动词
          </Badge>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {formsToShow.map(renderConjugationRow)}
      </div>
    </div>
  );
}
