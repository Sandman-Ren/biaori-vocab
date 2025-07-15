const fs = require('fs');
const path = require('path');

// Read vocabulary data
const vocabularyPath = path.join(__dirname, 'public', 'data', 'vocabulary.json');
const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));

// Simulate the new getPartOfSpeechInfo function
function getPartOfSpeechInfo(vocabulary) {
  const posCounts = new Map();
  
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
  
  const getSemanticOrder = (pos) => {
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

const partsOfSpeech = getPartOfSpeechInfo(vocabulary);

console.log('Parts of Speech (Semantic Ordering):');
partsOfSpeech.forEach((pos, index) => {
  console.log(`${index + 1}. ${pos.name} (${pos.count} items)`);
});
