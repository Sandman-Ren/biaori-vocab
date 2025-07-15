# 数据重现步骤 - vocabulary.json 完整重现指南

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 提供从零开始重现 vocabulary.json 的详细步骤和完整工具链

## 🎯 目标

本文档提供了完全重现 `vocabulary.json` 文件的详细步骤，包括环境配置、工具安装、数据爬取、处理和验证的全过程。

## 📋 前置要求

### 系统要求
- **操作系统**: macOS/Linux/Windows
- **Python**: 3.8+ 
- **Node.js**: 18+
- **内存**: 最低4GB，推荐8GB+
- **磁盘空间**: 至少1GB可用空间
- **网络**: 稳定的互联网连接

### 开发工具
- **代码编辑器**: VS Code (推荐)
- **Git**: 版本控制
- **浏览器**: Chrome/Firefox (用于调试)

## 🚀 完整重现步骤

### 第一步：环境准备

#### 1.1 克隆项目
```bash
# 克隆仓库
git clone https://github.com/your-username/biaori-vocab.git
cd biaori-vocab

# 创建工作分支
git checkout -b data-reproduction
```

#### 1.2 安装依赖
```bash
# 安装Node.js依赖
npm install

# 创建Python虚拟环境
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 或者 venv\Scripts\activate  # Windows

# 安装Python依赖
pip install requests beautifulsoup4 lxml pandas json5
```

### 第二步：数据爬取

#### 2.1 准备爬虫脚本

创建 `scraper.py`（基于现有后处理逻辑反推）:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中日交流标准日本语词汇爬虫
从 jp.qsbdc.com 爬取完整词汇数据
"""

import requests
import json
import uuid
import time
import re
from datetime import datetime
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BiaoRiVocabScraper:
    def __init__(self):
        self.base_url = "http://jp.qsbdc.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.vocabulary_data = []
        
    def clean_text(self, text: str) -> str:
        """清理文本"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())
    
    def get_lesson_list(self) -> List[Dict]:
        """获取所有课程列表"""
        lessons = []
        
        # 新标准日本语课程ID范围（根据现有数据推测）
        lesson_ranges = {
            "新标初": range(1, 100),    # lesson_id 1-99
            "新标中": range(100, 200),  # lesson_id 100-199  
            "新标高": range(200, 350),  # lesson_id 200-349
        }
        
        for book_series, lesson_range in lesson_ranges.items():
            for lesson_id in lesson_range:
                lessons.append({
                    "lesson_id": str(lesson_id),
                    "book_series": book_series,
                    "lesson_url": f"{self.base_url}/jpword/word_list.php?lesson_id={lesson_id}"
                })
                
        logger.info(f"准备爬取 {len(lessons)} 个课程")
        return lessons
    
    def scrape_lesson_vocabulary(self, lesson: Dict) -> List[Dict]:
        """爬取单个课程的词汇"""
        lesson_id = lesson["lesson_id"]
        lesson_url = lesson["lesson_url"]
        
        try:
            response = self.session.get(lesson_url, timeout=10)
            response.encoding = 'utf-8'
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 解析课程名称
            lesson_name = self.extract_lesson_name(soup, lesson["book_series"])
            
            # 查找词汇表格
            vocab_table = soup.find('table', class_='word-table')  # 需要根据实际HTML调整
            if not vocab_table:
                logger.warning(f"课程 {lesson_id} 未找到词汇表格")
                return []
            
            words = []
            rows = vocab_table.find_all('tr')[1:]  # 跳过表头
            
            for i, row in enumerate(rows, 1):
                try:
                    word_data = self.parse_word_row(row, lesson, lesson_name, str(i))
                    if word_data:
                        words.append(word_data)
                except Exception as e:
                    logger.error(f"解析词汇行失败 (课程{lesson_id}, 行{i}): {e}")
                    continue
            
            logger.info(f"课程 {lesson_id} 爬取完成: {len(words)} 个词汇")
            time.sleep(1)  # 避免请求过快
            return words
            
        except Exception as e:
            logger.error(f"爬取课程 {lesson_id} 失败: {e}")
            return []
    
    def extract_lesson_name(self, soup: BeautifulSoup, book_series: str) -> str:
        """提取课程名称"""
        # 根据实际HTML结构调整选择器
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = self.clean_text(title_elem.get_text())
            # 格式化为标准格式：新标初_01
            return f"{book_series}_{title}"
        return f"{book_series}_未知"
    
    def parse_word_row(self, row, lesson: Dict, lesson_name: str, word_number: str) -> Optional[Dict]:
        """解析单个词汇行"""
        cells = row.find_all('td')
        if len(cells) < 5:  # 确保有足够的列
            return None
        
        # 根据实际HTML结构调整索引
        japanese_word = self.clean_text(cells[0].get_text())
        reading = self.clean_text(cells[1].get_text())
        chinese_meaning = self.clean_text(cells[2].get_text())
        part_of_speech = self.clean_text(cells[3].get_text())
        
        # 提取例句
        example_sentences = []
        example_cell = cells[4] if len(cells) > 4 else None
        if example_cell:
            examples = example_cell.find_all('div') or [example_cell]
            for example in examples:
                example_text = self.clean_text(example.get_text())
                if example_text:
                    example_sentences.append(example_text)
        
        # 检查发音URL
        pronunciation_url = None
        audio_link = row.find('a', href=re.compile(r'\.mp3|\.wav'))
        if audio_link:
            pronunciation_url = self.base_url + audio_link['href']
        
        return {
            "_id": str(uuid.uuid4()),
            "book_id": self.get_book_id(lesson_name),
            "lesson_id": lesson["lesson_id"],
            "lesson_name": lesson_name,
            "lesson_url": lesson["lesson_url"],
            "word_number": word_number,
            "japanese_word": japanese_word,
            "reading": reading,
            "pronunciation_url": pronunciation_url,
            "chinese_meaning": chinese_meaning,
            "part_of_speech": part_of_speech,
            "example_sentences": example_sentences,
            "page_url": lesson["lesson_url"],
            "scraped_at": datetime.now().isoformat()
        }
    
    def get_book_id(self, lesson_name: str) -> str:
        """根据课程名称推断教材ID"""
        if "新标初" in lesson_name:
            return "7"  # 新标准日本语初级
        elif "新标中" in lesson_name:
            return "8"  # 新标准日本语中级
        elif "新标高" in lesson_name:
            return "9"  # 新标准日本语高级
        return "0"  # 未知教材
    
    def scrape_all_vocabulary(self) -> List[Dict]:
        """爬取所有词汇"""
        lessons = self.get_lesson_list()
        all_vocabulary = []
        
        for i, lesson in enumerate(lessons, 1):
            logger.info(f"爬取进度: {i}/{len(lessons)} - 课程 {lesson['lesson_id']}")
            
            words = self.scrape_lesson_vocabulary(lesson)
            all_vocabulary.extend(words)
            
            if i % 10 == 0:  # 每10个课程保存一次
                self.save_data(all_vocabulary, f"backup_lesson_{i}.json")
        
        return all_vocabulary
    
    def save_data(self, data: List[Dict], filename: str = "raw_vocabulary.json"):
        """保存数据到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"数据已保存到 {filename}: {len(data)} 个词汇")

def main():
    """主函数"""
    scraper = BiaoRiVocabScraper()
    
    try:
        # 爬取所有词汇
        vocabulary_data = scraper.scrape_all_vocabulary()
        
        # 保存原始数据
        scraper.save_data(vocabulary_data, "raw_vocabulary.json")
        
        logger.info(f"爬取完成! 总计 {len(vocabulary_data)} 个词汇")
        
    except KeyboardInterrupt:
        logger.info("用户中断爬取")
    except Exception as e:
        logger.error(f"爬取失败: {e}")

if __name__ == "__main__":
    main()
```

#### 2.2 运行爬虫
```bash
# 激活Python环境
source venv/bin/activate

# 运行爬虫
python scraper.py

# 等待爬取完成（预计1-2小时）
# 会生成 raw_vocabulary.json 文件
```

### 第三步：数据后处理

#### 3.1 动词变位处理
```bash
# 使用现有的变位脚本处理数据
node hydrate-conjugations.js

# 这会将 raw_vocabulary.json 处理为 vocabulary.json
# 并为所有动词添加完整的变位形式
```

#### 3.2 验证处理结果
```bash
# 运行验证脚本
node verify-conjugations.js

# 检查语义顺序
node test-semantic-order.js
```

### 第四步：数据验证与优化

#### 4.1 验证数据完整性
```bash
# 检查文件是否生成
ls -la public/data/vocabulary.json

# 检查词汇数量（应该约2800+个）
cat public/data/vocabulary.json | jq '. | length'

# 检查动词数量和变位
cat public/data/vocabulary.json | jq '[.[] | select(.part_of_speech | test("动[123]"))] | length'
```

#### 4.2 质量检查脚本
```bash
# 创建快速检查脚本
cat > check_data_quality.js << 'EOF'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/vocabulary.json', 'utf8'));

console.log('=== 数据质量报告 ===');
console.log(`总词汇数: ${data.length}`);

const verbs = data.filter(item => ['动1', '动2', '动3'].includes(item.part_of_speech));
console.log(`动词数量: ${verbs.length}`);

const verbsWithConjugations = verbs.filter(verb => verb.conjugations);
console.log(`带变位动词: ${verbsWithConjugations.length}`);

const books = [...new Set(data.map(item => item.book_id))].sort();
console.log(`教材数量: ${books.length} (${books.join(', ')})`);

const lessons = [...new Set(data.map(item => item.lesson_id))].sort((a,b) => parseInt(a) - parseInt(b));
console.log(`课程数量: ${lessons.length} (${lessons[0]} - ${lessons[lessons.length-1]})`);

console.log('\n=== 样本数据 ===');
console.log('第一个词汇:', JSON.stringify(data[0], null, 2).slice(0, 500) + '...');
EOF

node check_data_quality.js
```

### 第五步：最终验证和部署

#### 5.1 完整性测试
```bash
# 运行完整的测试套件
npm test  # 如果有测试

# 启动开发服务器测试
npm run dev

# 在浏览器中访问 http://localhost:3000 验证功能
```

#### 5.2 性能测试
```bash
# 检查文件大小
ls -lh public/data/vocabulary.json

# 测试加载性能
time curl -s http://localhost:3000/data/vocabulary.json > /dev/null
```

#### 5.3 构建生产版本
```bash
# 构建静态版本
npm run build

# 验证构建结果
ls -la out/
```

## 🔧 故障排除

### 常见问题和解决方案

#### 问题1：爬虫被反爬
**现象**: HTTP 403/429错误
**解决**: 
```bash
# 增加请求间隔
# 在 scraper.py 中调整 time.sleep(2)

# 更换User-Agent
# 在 session.headers 中更新
```

#### 问题2：编码问题
**现象**: 中文或日文显示乱码
**解决**:
```bash
# 检查文件编码
file -I public/data/vocabulary.json

# 强制UTF-8编码
iconv -f GBK -t UTF-8 vocabulary.json > vocabulary_utf8.json
```

#### 问题3：动词变位失败
**现象**: verify-conjugations.js 报告变位缺失
**解决**:
```bash
# 清除缓存重新处理
rm public/data/vocabulary.json
node hydrate-conjugations.js

# 检查特定动词
node -e "
const data = require('./public/data/vocabulary.json');
const verb = data.find(item => item.japanese_word === '行きます');
console.log(JSON.stringify(verb.conjugations, null, 2));
"
```

#### 问题4：数据量不正确
**现象**: 词汇数量少于预期
**解决**:
```bash
# 检查爬虫日志
grep "爬取完成" scraper.log

# 检查课程覆盖
node -e "
const data = require('./public/data/vocabulary.json');
const lessons = [...new Set(data.map(item => item.lesson_id))];
console.log('缺失课程:', lessons.filter(id => parseInt(id) < 100).length);
"
```

## 📊 验证清单

### 数据完整性
- [ ] 总词汇数 ≥ 2800
- [ ] 动词数量 ≥ 800
- [ ] 变位覆盖率 ≥ 95%
- [ ] 教材覆盖：新标初、中、高级
- [ ] 课程数量 ≥ 100

### 数据质量
- [ ] 所有必填字段完整
- [ ] 日文字符显示正确
- [ ] 中文翻译完整
- [ ] 例句格式正确
- [ ] UUID格式正确
- [ ] 时间戳格式正确

### 功能验证
- [ ] 网站正常加载
- [ ] 筛选功能正常
- [ ] 搜索功能正常
- [ ] 模态框正常显示
- [ ] 导出功能正常
- [ ] 移动端显示正常

## 🕒 时间预估

| 步骤 | 预估时间 | 说明 |
|------|----------|------|
| 环境配置 | 30分钟 | 首次配置，后续可复用 |
| 爬虫开发 | 2-4小时 | 需要分析网站结构 |
| 数据爬取 | 1-2小时 | 网络速度依赖 |
| 后处理 | 10分钟 | 自动化脚本 |
| 验证测试 | 30分钟 | 手动检查 |
| **总计** | **4-7小时** | 首次完整重现 |

## 📝 重现记录模板

```markdown
## 重现记录 - [日期]

### 环境信息
- 操作系统: 
- Python版本: 
- Node.js版本: 
- 爬取时间: 

### 数据统计
- 爬取课程数: 
- 总词汇数: 
- 动词数量: 
- 文件大小: 

### 问题记录
1. 
2. 
3. 

### 解决方案
1. 
2. 
3. 

### 验证结果
- [ ] 功能测试通过
- [ ] 性能测试通过
- [ ] 数据质量检查通过
```

## 🔄 自动化脚本

创建一键重现脚本：

```bash
#!/bin/bash
# reproduce_vocabulary.sh - 一键重现 vocabulary.json

set -e  # 遇到错误时停止

echo "🚀 开始重现 vocabulary.json..."

# 1. 环境检查
echo "📋 检查环境..."
python3 --version
node --version

# 2. 安装依赖
echo "📦 安装依赖..."
pip install -r requirements.txt
npm install

# 3. 数据爬取
echo "🕷️ 开始数据爬取..."
python scraper.py

# 4. 后处理
echo "🔧 数据后处理..."
node hydrate-conjugations.js

# 5. 验证
echo "✅ 验证数据..."
node verify-conjugations.js
node test-semantic-order.js

# 6. 质量检查
echo "📊 质量检查..."
node check_data_quality.js

echo "🎉 重现完成! vocabulary.json 已生成"
echo "📍 文件位置: public/data/vocabulary.json"

# 7. 启动测试服务器
echo "🌐 启动测试服务器..."
npm run dev
```

## 📚 相关文档

- [数据生命周期](data-lifecycle.md) - 完整数据流程
- [数据结构规范](data-structure.md) - 数据格式详解  
- [后处理指南](post-processing-guide.md) - Python实现参考
- [系统设计文档](../design/system-design.md) - 整体架构

---

*本文档确保 vocabulary.json 可以完全重现。如遇问题，请参考故障排除部分或提交GitHub Issue。*
