const fs = require('fs');
const path = require('path');

// Verification script to check conjugation hydration results
function verifyConjugations() {
  const vocabularyPath = path.join(__dirname, 'public', 'data', 'vocabulary.json');
  const data = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));
  
  const results = {
    totalItems: data.length,
    totalVerbs: 0,
    verbsWithConjugations: 0,
    nonVerbsWithConjugations: 0,
    verbsWithoutConjugations: 0,
    verbsWithPrecomputed: 0,
    verbsWithJmdict: 0,
    verbBreakdown: { '动1': 0, '动2': 0, '动3': 0 },
    examples: {
      group1: [],
      group2: [],
      group3: [],
      nonVerbWithConjugations: []
    }
  };

  data.forEach(item => {
    const isVerb = ['动1', '动2', '动3'].includes(item.part_of_speech);
    
    if (isVerb) {
      results.totalVerbs++;
      results.verbBreakdown[item.part_of_speech]++;
      
      if (item.conjugations) {
        results.verbsWithConjugations++;
        
        if (item.conjugations.precomputed) {
          results.verbsWithPrecomputed++;
        }
        if (item.conjugations.jmdict) {
          results.verbsWithJmdict++;
        }

        // Collect examples
        if (item.part_of_speech === '动1' && results.examples.group1.length < 3) {
          results.examples.group1.push({
            word: item.japanese_word,
            reading: item.reading,
            casual_present: item.conjugations.precomputed?.casual_present
          });
        } else if (item.part_of_speech === '动2' && results.examples.group2.length < 3) {
          results.examples.group2.push({
            word: item.japanese_word,
            reading: item.reading,
            casual_present: item.conjugations.precomputed?.casual_present
          });
        } else if (item.part_of_speech === '动3' && results.examples.group3.length < 3) {
          results.examples.group3.push({
            word: item.japanese_word,
            reading: item.reading,
            casual_present: item.conjugations.precomputed?.casual_present
          });
        }
      } else {
        results.verbsWithoutConjugations++;
      }
    } else {
      // Non-verb
      if (item.conjugations) {
        results.nonVerbsWithConjugations++;
        if (results.examples.nonVerbWithConjugations.length < 5) {
          results.examples.nonVerbWithConjugations.push({
            word: item.japanese_word,
            reading: item.reading,
            part_of_speech: item.part_of_speech
          });
        }
      }
    }
  });

  // Display results
  console.log('=== CONJUGATION VERIFICATION REPORT ===');
  console.log(`Total vocabulary items: ${results.totalItems}`);
  console.log(`Total verbs: ${results.totalVerbs}`);
  console.log(`  - Group 1 (动1): ${results.verbBreakdown['动1']}`);
  console.log(`  - Group 2 (动2): ${results.verbBreakdown['动2']}`);
  console.log(`  - Group 3 (动3): ${results.verbBreakdown['动3']}`);
  console.log(`\nConjugation Coverage:`);
  console.log(`  - Verbs with conjugations: ${results.verbsWithConjugations}/${results.totalVerbs}`);
  console.log(`  - Verbs without conjugations: ${results.verbsWithoutConjugations}`);
  console.log(`  - Non-verbs with conjugations: ${results.nonVerbsWithConjugations}`);
  console.log(`\nConjugation Sources:`);
  console.log(`  - Verbs with precomputed: ${results.verbsWithPrecomputed}`);
  console.log(`  - Verbs with jmdict: ${results.verbsWithJmdict}`);

  if (results.examples.group1.length > 0) {
    console.log(`\nGroup 1 Examples:`);
    results.examples.group1.forEach(ex => {
      console.log(`  ${ex.word} (${ex.reading}) → ${ex.casual_present}`);
    });
  }

  if (results.examples.group2.length > 0) {
    console.log(`\nGroup 2 Examples:`);
    results.examples.group2.forEach(ex => {
      console.log(`  ${ex.word} (${ex.reading}) → ${ex.casual_present}`);
    });
  }

  if (results.examples.group3.length > 0) {
    console.log(`\nGroup 3 Examples:`);
    results.examples.group3.forEach(ex => {
      console.log(`  ${ex.word} (${ex.reading}) → ${ex.casual_present}`);
    });
  }

  if (results.examples.nonVerbWithConjugations.length > 0) {
    console.log(`\n⚠️  Non-verbs with conjugations (should be 0):`);
    results.examples.nonVerbWithConjugations.forEach(ex => {
      console.log(`  ${ex.word} (${ex.reading}) [${ex.part_of_speech}]`);
    });
  }

  // Status summary
  const allVerbsHaveConjugations = results.verbsWithConjugations === results.totalVerbs;
  const noNonVerbsHaveConjugations = results.nonVerbsWithConjugations === 0;
  const allVerbsHavePrecomputed = results.verbsWithPrecomputed === results.totalVerbs;

  console.log(`\n=== STATUS ===`);
  console.log(`✅ All verbs have conjugations: ${allVerbsHaveConjugations}`);
  console.log(`✅ No non-verbs have conjugations: ${noNonVerbsHaveConjugations}`);
  console.log(`✅ All verbs have precomputed conjugations: ${allVerbsHavePrecomputed}`);
  
  if (allVerbsHaveConjugations && noNonVerbsHaveConjugations && allVerbsHavePrecomputed) {
    console.log(`\n🎉 VERIFICATION PASSED - All conjugations are properly hydrated!`);
  } else {
    console.log(`\n❌ VERIFICATION FAILED - Some issues found above.`);
  }

  return results;
}

if (require.main === module) {
  verifyConjugations();
}

module.exports = { verifyConjugations };
