import { VocabularyItem, VerbConjugations } from '@/lib/types';
import { generateSampleConjugations } from '@/lib/conjugation-utils';

interface PDFGenerationOptions {
  selectedVocabulary: VocabularyItem[];
  selectedConjugations: (keyof VerbConjugations)[];
  includeExamples?: boolean;
  includeAnswers?: boolean;
}

// Conjugation form labels in Chinese
const CONJUGATION_LABELS: Record<keyof VerbConjugations, string> = {
  polite_present: '现在时（敬语）',
  polite_past: '过去时（敬语）',
  polite_negative: '否定（敬语）',
  polite_past_negative: '过去否定（敬语）',
  casual_present: '现在时（简体）',
  casual_past: '过去时（简体）',
  casual_negative: '否定（简体）',
  casual_past_negative: '过去否定（简体）',
  te_form: 'Te形',
  potential: '可能形',
  passive: '被动形',
  causative: '使役形',
  imperative: '命令形',
  conditional: '条件形',
  volitional: '意志形'
};

// Difficulty level indicators
const CONJUGATION_LEVELS: Record<keyof VerbConjugations, string> = {
  polite_present: '基础',
  polite_past: '基础',
  polite_negative: '基础',
  polite_past_negative: '中级',
  casual_present: '基础',
  casual_past: '基础',
  casual_negative: '基础',
  casual_past_negative: '中级',
  te_form: '中级',
  potential: '中级',
  passive: '高级',
  causative: '高级',
  imperative: '高级',
  conditional: '高级',
  volitional: '高级'
};

export function generateVerbConjugationPDF(options: PDFGenerationOptions): void {
  const { selectedVocabulary, selectedConjugations, includeExamples = true, includeAnswers = true } = options;
  
  // Filter verbs and generate conjugations if needed
  const verbsWithConjugations: (VocabularyItem & { conjugations: VerbConjugations })[] = selectedVocabulary
    .filter(item => item.part_of_speech.includes('动'))
    .map(verb => {
      // If verb already has conjugations, use them; otherwise generate them
      if (verb.conjugations) {
        return verb as VocabularyItem & { conjugations: VerbConjugations };
      } else {
        // Extract verb group from part_of_speech (动1, 动2, 动3)
        const verbGroup = verb.part_of_speech.includes('动1') ? '1' : 
                         verb.part_of_speech.includes('动2') ? '2' : '3';
        
        // Generate conjugations using the reading (which should be the polite form)
        const generatedConjugations = generateSampleConjugations(verb.reading, verbGroup);
        
        return {
          ...verb,
          conjugations: generatedConjugations
        } as VocabularyItem & { conjugations: VerbConjugations };
      }
    });

  if (verbsWithConjugations.length === 0) {
    const selectedWords = selectedVocabulary.length;
    const totalVerbs = selectedVocabulary.filter(item => item.part_of_speech.includes('动')).length;
    
    if (totalVerbs === 0) {
      alert('没有选中的动词。请先筛选并选择一些动词（词性包含"动"的词汇）。');
    } else {
      alert(`选中的 ${selectedWords} 个词汇中没有动词。请选择一些动词（共 ${totalVerbs} 个动词可选）。`);
    }
    return;
  }

  // Generate HTML content for the PDF
  const htmlContent = generatePDFHTML(verbsWithConjugations, selectedConjugations, includeExamples, includeAnswers);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('无法打开打印窗口。请检查浏览器的弹窗设置。');
    return;
  }

  // Write the HTML content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      
      // Show success message after a delay
      const worksheetType = includeAnswers ? '答案册' : '练习册';
      setTimeout(() => {
        alert(`✅ 成功生成动词变位${worksheetType}！\n\n📄 请在打印对话框中选择"保存为PDF"\n🎌 动词数量: ${verbsWithConjugations.length}\n📝 变位形式: ${selectedConjugations.length}`);
      }, 500);
    }, 500);
  };
}

function generatePDFHTML(
  verbsWithConjugations: (VocabularyItem & { conjugations: VerbConjugations })[],
  selectedConjugations: (keyof VerbConjugations)[],
  includeExamples: boolean,
  includeAnswers: boolean
): string {
  const worksheetType = includeAnswers ? '答案册' : '练习册';
  const currentDate = new Date().toLocaleDateString('zh-CN');
  
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>动词变位${worksheetType}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: "Noto Sans CJK SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background: white;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }
        
        .page-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        
        .page-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .legend {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #3b82f6;
        }
        
        .legend-title {
          font-weight: bold;
          margin-bottom: 8px;
          color: #1e40af;
        }
        
        .verb-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #fafafa;
        }
        
        .verb-header {
          margin-bottom: 15px;
        }
        
        .verb-word {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .verb-reading {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        
        .verb-meaning {
          font-size: 14px;
          color: #374151;
          margin-bottom: 5px;
        }
        
        .verb-lesson {
          font-size: 12px;
          color: #9ca3af;
        }
        
        .conjugation-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .conjugation-table th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .conjugation-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          vertical-align: top;
        }
        
        .conjugation-form {
          font-weight: 500;
          color: #1f2937;
        }
        
        .difficulty-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .difficulty-basic {
          background: #dcfce7;
          color: #166534;
        }
        
        .difficulty-intermediate {
          background: #fef3c7;
          color: #92400e;
        }
        
        .difficulty-advanced {
          background: #fecaca;
          color: #991b1b;
        }
        
        .answer-field {
          min-height: 24px;
          border-bottom: 1px solid #9ca3af;
          min-width: 150px;
          display: inline-block;
        }
        
        .examples-section {
          margin-top: 20px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }
        
        .examples-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #065f46;
        }
        
        .example-item {
          margin-bottom: 8px;
          padding-left: 15px;
          position: relative;
        }
        
        .example-item:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        
        @media print {
          body {
            font-size: 12px;
          }
          
          .page-title {
            font-size: 20px;
          }
          
          .verb-word {
            font-size: 18px;
          }
          
          .verb-section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="page-header">
        <div class="page-title">动词变位${worksheetType}</div>
        <div class="page-subtitle">共 ${verbsWithConjugations.length} 个动词 | ${selectedConjugations.length} 种变位形式</div>
        <div class="page-subtitle">生成时间: ${currentDate}</div>
      </div>
      
      <div class="legend">
        <div class="legend-title">📚 难度等级说明</div>
        <div>
          <span class="difficulty-badge difficulty-basic">基础</span> 初学者必备形式 | 
          <span class="difficulty-badge difficulty-intermediate">中级</span> 中等水平形式 | 
          <span class="difficulty-badge difficulty-advanced">高级</span> 进阶学习形式
        </div>
      </div>
      
      ${verbsWithConjugations.map((verb, index) => `
        <div class="verb-section">
          <div class="verb-header">
            <div class="verb-word">${index + 1}. ${verb.japanese_word}</div>
            <div class="verb-reading">读音: ${verb.reading}</div>
            <div class="verb-meaning">含义: ${verb.chinese_meaning}</div>
            <div class="verb-lesson">课程: ${verb.lesson_name}</div>
          </div>
          
          <table class="conjugation-table">
            <thead>
              <tr>
                <th>变位形式</th>
                <th>难度</th>
                <th>${includeAnswers ? '答案' : '练习'}</th>
              </tr>
            </thead>
            <tbody>
              ${selectedConjugations.map(conjugationKey => {
                const label = CONJUGATION_LABELS[conjugationKey];
                const level = CONJUGATION_LEVELS[conjugationKey];
                const answer = verb.conjugations[conjugationKey] || '';
                const difficultyClass = level === '基础' ? 'difficulty-basic' : 
                                      level === '中级' ? 'difficulty-intermediate' : 'difficulty-advanced';
                
                return `
                  <tr>
                    <td class="conjugation-form">• ${label}</td>
                    <td><span class="difficulty-badge ${difficultyClass}">${level}</span></td>
                    <td>${includeAnswers ? answer : '<span class="answer-field"></span>'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          ${includeExamples && verb.example_sentences && verb.example_sentences.length > 0 ? `
            <div class="examples-section">
              <div class="examples-title">例句</div>
              ${verb.example_sentences.slice(0, 2).map(example => `
                <div class="example-item">${example}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
      
      <div class="footer">
        <div>💡 学习提示: 反复练习动词变位，加强记忆。建议先完成练习册，再对照答案册检查。</div>
        <div>🎌 日语学习 | 动词变位练习系统</div>
      </div>
    </body>
    </html>
  `;
}

export function generateVerbConjugationWorksheet(options: PDFGenerationOptions): void {
  // Generate a practice worksheet without answers
  generateVerbConjugationPDF({
    ...options,
    includeAnswers: false
  });
}

export function generateVerbConjugationAnswerKey(options: PDFGenerationOptions): void {
  // Generate answer key with all answers
  generateVerbConjugationPDF({
    ...options,
    includeAnswers: true
  });
}
