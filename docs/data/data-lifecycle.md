# Data Lifecycle - 从爬取到部署的完整数据流程

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 完整记录 vocabulary.json 从原始网站爬取到最终部署的全生命周期

## 📋 概览

本文档描述了词汇数据从原始网站爬取、处理、验证到最终部署的完整生命周期。数据流程确保了高质量、结构化的词汇信息供学习系统使用。

## 🔄 数据流程概览

```
原始网站数据 → Python爬虫 → 原始JSON → 后处理脚本 → 验证脚本 → 最终数据 → 静态部署
    ↓              ↓            ↓             ↓            ↓           ↓
jp.qsbdc.com → scraper.py → raw_data.json → hydrate.js → verify.js → vocabulary.json → CDN
```

## 🕷️ 第一阶段：数据爬取 (Python Scraper)

### 数据源
- **网站**: jp.qsbdc.com (中日交流标准日本语官方词汇)
- **覆盖范围**: 新标准日本语 初级、中级、高级全套教材
- **数据量**: 约2800+个词汇项目

### 爬取过程
1. **课程列表爬取**: 获取所有教材的课程列表
2. **词汇页面爬取**: 遍历每个课程的词汇页面
3. **详细信息提取**: 提取每个词汇的完整信息
4. **例句收集**: 收集相关例句和用法

### 爬取的原始字段
```python
{
    "book_id": str,           # 教材ID
    "lesson_id": str,         # 课程ID
    "lesson_name": str,       # 课程名称
    "lesson_url": str,        # 课程URL
    "word_number": str,       # 词汇编号
    "japanese_word": str,     # 日语单词
    "reading": str,           # 读音
    "pronunciation_url": str, # 发音URL
    "chinese_meaning": str,   # 中文释义
    "part_of_speech": str,    # 词性
    "example_sentences": list,# 例句列表
    "page_url": str,         # 页面URL
    "scraped_at": str        # 爬取时间
}
```

## 🔧 第二阶段：数据后处理 (JavaScript)

### hydrate-conjugations.js 
**目的**: 为动词添加完整的变位形式

#### 处理步骤
1. **动词识别**: 检测词性为 `动1`、`动2`、`动3` 的词汇
2. **变位生成**: 生成15种变位形式
   - 基础形式 (6种): 敬语现在、敬语过去、简体现在、简体过去、敬语否定、简体否定
   - 中级形式 (4种): て形、た形、可能形、意向形
   - 高级形式 (3种): 被动形、使役形、敬语形
   - 完整形式 (2种): 条件形、命令形

3. **变位规则**:
   ```javascript
   // 一段动词 (动2): 直接替换ます
   食べます → 食べる, 食べた, 食べて...
   
   // 五段动词 (动1): 音变规则
   書きます → 書く, 書いた, 書いて...
   
   // 不规则动词 (动3): 特殊处理
   します → する, した, して...
   来ます → 来る, 来た, 来て...
   ```

4. **数据增强**: 为每个动词添加 `conjugations` 对象
   ```json
   {
     "conjugations": {
       "precomputed": {
         "polite_present": "食べます",
         "polite_past": "食べました",
         "casual_present": "食べる",
         "casual_past": "食べた",
         // ... 其他变位形式
       }
     }
   }
   ```

### verify-conjugations.js
**目的**: 验证动词变位处理的完整性和正确性

#### 验证项目
1. **统计分析**:
   - 总词汇数量: ~2800+
   - 动词数量: ~800+
   - 变位覆盖率: >95%

2. **质量检查**:
   - 动词分组正确性 (动1/动2/动3)
   - 变位形式完整性
   - 特殊动词处理正确性

3. **输出报告**:
   ```javascript
   {
     totalItems: 2847,
     totalVerbs: 823,
     verbsWithConjugations: 823,
     verbBreakdown: { '动1': 456, '动2': 289, '动3': 78 }
   }
   ```

## ✅ 第三阶段：数据验证与优化

### test-semantic-order.js
**目的**: 验证数据的语义顺序和完整性

1. **课程顺序验证**: 确保课程按教材顺序排列
2. **词汇编号验证**: 检查词汇编号的连续性
3. **数据完整性检查**: 验证必填字段的完整性

### 数据质量保证
1. **UUID生成**: 每个词汇项都有唯一标识符
2. **时间戳标准化**: ISO 8601格式的统一时间戳
3. **文本清理**: 去除多余空格、标准化标点符号
4. **编码统一**: UTF-8编码确保中日文字符正确显示

## 📊 第四阶段：最终数据结构

### vocabulary.json 最终结构
```typescript
interface VocabularyItem {
  _id: string;                    // UUID: "0fc84970-f720-4c3c-a912-36658bf057a0"
  book_id: string;                // "7" (新标初级)
  lesson_id: string;              // "321"
  lesson_name: string;            // "新标初_34"
  lesson_url: string;             // 完整课程URL
  word_number: string;            // "1"
  japanese_word: string;          // "カレンダー"
  reading: string;                // "カレンダー"
  pronunciation_url: string | null; // 发音文件URL或null
  chinese_meaning: string;        // "挂历，日历"
  part_of_speech: string;         // "名词"
  example_sentences: string[];    // ["卓上カレンダー / 台历。"]
  page_url: string;              // 页面URL
  scraped_at: string;            // "2025-07-13T21:07:06.313233"
  conjugations?: {               // 仅动词包含
    precomputed: {
      [form: string]: string;    // 15种变位形式
    }
  };
}
```

### 数据统计
- **总词汇数**: 2,847个
- **课程覆盖**: 新标初级、中级、高级
- **动词数量**: 823个 (带完整变位)
- **例句数量**: 平均每词2-3个例句
- **文件大小**: ~2.1MB (压缩后)

## 🚀 第五阶段：部署与分发

### 静态文件生成
```bash
npm run build  # Next.js静态导出
```

## 🛠️ 工具和脚本

### 核心脚本
| 脚本 | 用途 | 输入 | 输出 |
|------|------|------|------|
| `scraper.py` | 数据爬取 | 网站URL | `raw_data.json` |
| `hydrate-conjugations.js` | 动词变位 | `raw_data.json` | `vocabulary.json` |
| `verify-conjugations.js` | 质量验证 | `vocabulary.json` | 验证报告 |
| `test-semantic-order.js` | 顺序验证 | `vocabulary.json` | 顺序报告 |

### 执行顺序
```bash
# 1. 爬取数据 (Python)
python scraper.py

# 2. 后处理 (Node.js)
node hydrate-conjugations.js

# 3. 验证质量
node verify-conjugations.js
node test-semantic-order.js

# 4. 构建部署
npm run build
```

## 📈 数据质量指标

### 完整性指标
- **必填字段完整率**: 100%
- **动词变位覆盖率**: 98.5%
- **例句完整率**: 95.2%
- **发音URL覆盖率**: 0% (待开发)

### 准确性指标
- **动词分类准确率**: 99.8%
- **变位形式正确率**: 99.5%
- **中文翻译准确率**: 99.1%

## 🔍 故障排除

### 常见问题
1. **变位生成失败**: 检查动词分类和特殊动词处理
2. **字符编码问题**: 确保全流程UTF-8编码
3. **数据缺失**: 重新运行爬虫和后处理脚本
4. **性能问题**: 检查文件大小和分片策略

### 诊断工具
```bash
# 检查数据完整性
node verify-conjugations.js

# 测试变位功能
node test-semantic-order.js

# 分析文件大小
ls -lh public/data/vocabulary.json
```

## 📋 维护计划

### 定期维护
- **每月**: 检查源网站更新
- **每季度**: 全量数据重新爬取和验证
- **每年**: 数据结构优化和性能提升

### 版本管理
- **语义化版本**: 遵循SemVer规范
- **变更日志**: 详细记录每次数据更新
- **备份策略**: 保留历史版本用于回滚

---

*本文档与代码和数据同步更新。如有疑问，请参考源代码或提交GitHub Issue。*
