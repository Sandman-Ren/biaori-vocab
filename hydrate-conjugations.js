const fs = require('fs');
const path = require('path');

// Japanese verb conjugation functions
class JapaneseConjugator {
  constructor() {
    // Kana mappings for sound changes
    this.aiueoMap = {
      'あ': 'あいうえお', 'か': 'かきくけこ', 'が': 'がぎぐげご',
      'さ': 'さしすせそ', 'ざ': 'ざじずぜぞ', 'た': 'たちつてと',
      'だ': 'だぢづでど', 'な': 'なにぬねの', 'は': 'はひふへほ',
      'ば': 'ばびぶべぼ', 'ぱ': 'ぱぴぷぺぽ', 'ま': 'まみむめも',
      'や': 'やゆよ', 'ら': 'らりるれろ', 'わ': 'わゐゑを'
    };
  }

  // Get the stem of a verb (remove ます)
  getStem(verb) {
    if (verb.endsWith('ます')) {
      return verb.slice(0, -2);
    }
    return verb;
  }

  // Get the dictionary form from ます form
  getDictionaryForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      // Group 1 (五段): Change final i-sound to u-sound
      const lastChar = stem.slice(-1);
      const mapping = {
        'き': 'く', 'ぎ': 'ぐ', 'し': 'す', 'じ': 'ず', 'ち': 'つ',
        'ぢ': 'づ', 'に': 'ぬ', 'ひ': 'ふ', 'び': 'ぶ', 'ぴ': 'ぷ',
        'み': 'む', 'り': 'る', 'い': 'う'
      };
      return stem.slice(0, -1) + (mapping[lastChar] || lastChar + 'る');
    } else if (group === '2') {
      // Group 2 (一段): Add る
      return stem + 'る';
    } else {
      // Group 3 (不規則): Handle special cases
      if (stem === 'し') return 'する';
      if (stem === 'き') return 'くる';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'する'; // Compound verbs with する
      return stem + 'る'; // fallback
    }
  }

  // Get the past form (た form)
  getPastForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      // Group 1 past form rules
      const mapping = {
        'き': 'いた', 'ぎ': 'いだ', 'し': 'した', 'ち': 'った',
        'に': 'んだ', 'び': 'んだ', 'み': 'んだ', 'り': 'った'
      };
      return base + (mapping[lastChar] || 'った');
    } else if (group === '2') {
      return stem + 'た';
    } else {
      if (stem === 'し') return 'した';
      if (stem === 'き') return 'きた';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'した'; // Compound verbs
      return stem + 'た';
    }
  }

  // Get the te form
  getTeForm(verb, group) {
    const pastForm = this.getPastForm(verb, group);
    return pastForm.replace(/た$/, 'て').replace(/だ$/, 'で');
  }

  // Get the negative form
  getNegativeForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'かない', 'ぎ': 'がない', 'し': 'さない', 'ち': 'たない',
        'に': 'なない', 'び': 'ばない', 'み': 'まない', 'り': 'らない'
      };
      return base + (mapping[lastChar] || 'らない');
    } else if (group === '2') {
      return stem + 'ない';
    } else {
      if (stem === 'し') return 'しない';
      if (stem === 'き') return 'こない';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'しない'; // Compound verbs
      return stem + 'ない';
    }
  }

  // Get the potential form
  getPotentialForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'ける', 'ぎ': 'げる', 'し': 'せる', 'ち': 'てる',
        'に': 'ねる', 'び': 'べる', 'み': 'める', 'り': 'れる'
      };
      return base + (mapping[lastChar] || 'れる');
    } else if (group === '2') {
      return stem + 'られる';
    } else {
      if (stem === 'し') return 'できる';
      if (stem === 'き') return 'こられる';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'できる'; // Compound verbs
      return stem + 'られる';
    }
  }

  // Get the passive form
  getPassiveForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'かれる', 'ぎ': 'がれる', 'し': 'される', 'ち': 'たれる',
        'に': 'なれる', 'び': 'ばれる', 'み': 'まれる', 'り': 'られる'
      };
      return base + (mapping[lastChar] || 'られる');
    } else if (group === '2') {
      return stem + 'られる';
    } else {
      if (stem === 'し') return 'される';
      if (stem === 'き') return 'こられる';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'される'; // Compound verbs
      return stem + 'られる';
    }
  }

  // Get the causative form
  getCausativeForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'かせる', 'ぎ': 'がせる', 'し': 'させる', 'ち': 'たせる',
        'に': 'なせる', 'び': 'ばせる', 'み': 'ませる', 'り': 'らせる'
      };
      return base + (mapping[lastChar] || 'らせる');
    } else if (group === '2') {
      return stem + 'させる';
    } else {
      if (stem === 'し') return 'させる';
      if (stem === 'き') return 'こさせる';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'させる'; // Compound verbs
      return stem + 'させる';
    }
  }

  // Get the imperative form
  getImperativeForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'け', 'ぎ': 'げ', 'し': 'せ', 'ち': 'て',
        'に': 'ね', 'び': 'べ', 'み': 'め', 'り': 'れ'
      };
      return base + (mapping[lastChar] || 'れ');
    } else if (group === '2') {
      return stem + 'ろ';
    } else {
      if (stem === 'し') return 'しろ';
      if (stem === 'き') return 'こい';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'しろ'; // Compound verbs
      return stem + 'ろ';
    }
  }

  // Get the conditional form
  getConditionalForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'けば', 'ぎ': 'げば', 'し': 'せば', 'ち': 'てば',
        'に': 'ねば', 'び': 'べば', 'み': 'めば', 'り': 'れば'
      };
      return base + (mapping[lastChar] || 'れば');
    } else if (group === '2') {
      return stem + 'れば';
    } else {
      if (stem === 'し') return 'すれば';
      if (stem === 'き') return 'くれば';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'すれば'; // Compound verbs
      return stem + 'れば';
    }
  }

  // Get the volitional form
  getVolitionalForm(verb, group) {
    const stem = this.getStem(verb);
    
    if (group === '1') {
      const lastChar = stem.slice(-1);
      const base = stem.slice(0, -1);
      
      const mapping = {
        'き': 'こう', 'ぎ': 'ごう', 'し': 'そう', 'ち': 'とう',
        'に': 'のう', 'び': 'ぼう', 'み': 'もう', 'り': 'ろう'
      };
      return base + (mapping[lastChar] || 'ろう');
    } else if (group === '2') {
      return stem + 'よう';
    } else {
      if (stem === 'し') return 'しよう';
      if (stem === 'き') return 'こよう';
      if (stem.endsWith('し')) return stem.slice(0, -1) + 'しよう'; // Compound verbs
      return stem + 'よう';
    }
  }

  // Generate all conjugations for a verb
  generateConjugations(verb, group) {
    const stem = this.getStem(verb);
    const dictionaryForm = this.getDictionaryForm(verb, group);
    const pastForm = this.getPastForm(verb, group);
    const negativeForm = this.getNegativeForm(verb, group);

    return {
      polite_present: verb,
      polite_past: stem + 'ました',
      polite_negative: stem + 'ません',
      polite_past_negative: stem + 'ませんでした',
      casual_present: dictionaryForm,
      casual_past: pastForm,
      casual_negative: negativeForm,
      casual_past_negative: negativeForm.replace(/ない$/, 'なかった'),
      te_form: this.getTeForm(verb, group),
      potential: this.getPotentialForm(verb, group),
      passive: this.getPassiveForm(verb, group),
      causative: this.getCausativeForm(verb, group),
      imperative: this.getImperativeForm(verb, group),
      conditional: this.getConditionalForm(verb, group),
      volitional: this.getVolitionalForm(verb, group)
    };
  }
}

// Main hydration logic
async function hydrateConjugations() {
  const vocabularyPath = path.join(__dirname, 'public', 'data', 'vocabulary.json');
  
  console.log('Reading vocabulary file...');
  const data = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));
  
  const conjugator = new JapaneseConjugator();
  const report = {
    verbsHydrated: [],
    verbsUpdated: [],
    nonVerbsCleared: [],
    errors: []
  };

  console.log(`Processing ${data.length} vocabulary items...`);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const isVerb = ['动1', '动2', '动3'].includes(item.part_of_speech);
    
    try {
      if (isVerb) {
        // This is a verb - ensure it has proper precomputed conjugations
        const group = item.part_of_speech.slice(-1); // Get '1', '2', or '3'
        const newConjugations = conjugator.generateConjugations(item.japanese_word, group);
        
        if (!item.conjugations) {
          // No conjugations exist - add them
          item.conjugations = {
            precomputed: newConjugations
          };
          report.verbsHydrated.push({
            id: item._id,
            word: item.japanese_word,
            reading: item.reading,
            part_of_speech: item.part_of_speech,
            action: 'added_conjugations'
          });
        } else {
          // Conjugations exist - update the precomputed section
          const hadPrecomputed = !!item.conjugations.precomputed;
          item.conjugations.precomputed = newConjugations;
          
          report.verbsUpdated.push({
            id: item._id,
            word: item.japanese_word,
            reading: item.reading,
            part_of_speech: item.part_of_speech,
            action: hadPrecomputed ? 'updated_precomputed' : 'added_precomputed'
          });
        }
      } else {
        // This is not a verb - remove any conjugations if they exist
        if (item.conjugations) {
          report.nonVerbsCleared.push({
            id: item._id,
            word: item.japanese_word,
            reading: item.reading,
            part_of_speech: item.part_of_speech,
            action: 'removed_conjugations'
          });
          delete item.conjugations;
        }
      }
    } catch (error) {
      report.errors.push({
        id: item._id,
        word: item.japanese_word,
        error: error.message
      });
    }

    // Progress indicator
    if ((i + 1) % 1000 === 0) {
      console.log(`Processed ${i + 1}/${data.length} items...`);
    }
  }

  console.log('Writing updated vocabulary file...');
  fs.writeFileSync(vocabularyPath, JSON.stringify(data, null, 2));

  // Generate and display report
  console.log('\n=== CONJUGATION HYDRATION REPORT ===');
  console.log(`Total items processed: ${data.length}`);
  console.log(`Verbs with new conjugations: ${report.verbsHydrated.length}`);
  console.log(`Verbs with updated conjugations: ${report.verbsUpdated.length}`);
  console.log(`Non-verbs with conjugations removed: ${report.nonVerbsCleared.length}`);
  console.log(`Errors encountered: ${report.errors.length}`);

  if (report.verbsHydrated.length > 0) {
    console.log('\n--- Verbs with NEW conjugations ---');
    report.verbsHydrated.slice(0, 10).forEach(item => {
      console.log(`- ${item.word} (${item.reading}) [${item.part_of_speech}]`);
    });
    if (report.verbsHydrated.length > 10) {
      console.log(`... and ${report.verbsHydrated.length - 10} more`);
    }
  }

  if (report.verbsUpdated.length > 0) {
    console.log('\n--- Verbs with UPDATED conjugations ---');
    report.verbsUpdated.slice(0, 10).forEach(item => {
      console.log(`- ${item.word} (${item.reading}) [${item.part_of_speech}] - ${item.action}`);
    });
    if (report.verbsUpdated.length > 10) {
      console.log(`... and ${report.verbsUpdated.length - 10} more`);
    }
  }

  if (report.nonVerbsCleared.length > 0) {
    console.log('\n--- Non-verbs with conjugations REMOVED ---');
    report.nonVerbsCleared.forEach(item => {
      console.log(`- ${item.word} (${item.reading}) [${item.part_of_speech}]`);
    });
  }

  if (report.errors.length > 0) {
    console.log('\n--- ERRORS ---');
    report.errors.forEach(error => {
      console.log(`- ${error.word}: ${error.error}`);
    });
  }

  console.log('\n=== HYDRATION COMPLETE ===');
  return report;
}

// Run the hydration
if (require.main === module) {
  hydrateConjugations().catch(console.error);
}

module.exports = { hydrateConjugations, JapaneseConjugator };
