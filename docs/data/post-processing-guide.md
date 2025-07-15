# Vocabulary Dataset Post-Processing Guide

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: July 14, 2025  
**Purpose**: Document all post-processing steps applied to vocabulary data for direct scraper integration

## Overview

This document outlines the complete post-processing pipeline applied to the vocabulary dataset in this Next.js application. The goal is to implement these same transformations in the Python scraper so that the output can be directly consumed by the website without additional processing.

## Expected Data Structure

The website expects vocabulary items to conform to this TypeScript interface:

```typescript
interface VocabularyItem {
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
  conjugations?: VerbConjugations;
}
```

## Python Post-Processing Implementation

### 1. Core Data Validation and Cleanup

```python
import uuid
import re
from datetime import datetime
from typing import List, Dict, Optional, Any

def clean_text(text: str) -> str:
    """Clean and normalize text fields"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove any control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
    
    return text

def generate_uuid() -> str:
    """Generate a unique identifier"""
    return str(uuid.uuid4())

def validate_required_fields(item: Dict[str, Any]) -> bool:
    """Validate that all required fields are present"""
    required_fields = [
        'japanese_word', 'reading', 'chinese_meaning', 
        'part_of_speech', 'lesson_name'
    ]
    
    for field in required_fields:
        if not item.get(field) or not str(item[field]).strip():
            return False
    
    return True
```

### 2. Book ID Mapping and Normalization

```python
def map_book_id(book_info: str) -> str:
    """
    Map book information to standardized book IDs
    Expected mappings:
    - '7' → '新标初' (New Standard Elementary)
    - '8' → '新标中' (New Standard Intermediate) 
    - '9' → '新标高' (New Standard Advanced)
    """
    book_mapping = {
        '新标初': '7',
        '新标准日本语初级': '7',
        'elementary': '7',
        'basic': '7',
        '初级': '7',
        '初': '7',
        
        '新标中': '8',
        '新标准日本语中级': '8',
        'intermediate': '8',
        '中级': '8',
        '中': '8',
        
        '新标高': '9',
        '新标准日本语高级': '9',
        'advanced': '9',
        '高级': '9',
        '高': '9'
    }
    
    # Normalize input
    normalized = clean_text(book_info).lower()
    
    # Try exact matches first
    for key, value in book_mapping.items():
        if key.lower() in normalized:
            return value
    
    # Extract number if present
    numbers = re.findall(r'\d+', book_info)
    if numbers:
        num = numbers[0]
        if num in ['7', '8', '9']:
            return num
    
    # Default to elementary if unclear
    return '7'

def get_book_name(book_id: str) -> str:
    """Get human-readable book name from ID"""
    book_names = {
        '7': '新标初',
        '8': '新标中',
        '9': '新标高'
    }
    return book_names.get(book_id, f'Book {book_id}')
```

### 3. Lesson Name Normalization

```python
def normalize_lesson_name(lesson_info: str, book_id: str) -> str:
    """
    Normalize lesson names to match expected format: 'new_book_name_lesson_number'
    Examples: '新标初_34', '新标中_12', '新标高_05'
    """
    if not lesson_info:
        return f"{get_book_name(book_id)}_01"
    
    # Extract lesson number
    lesson_numbers = re.findall(r'\d+', lesson_info)
    lesson_num = lesson_numbers[0] if lesson_numbers else "01"
    
    # Pad with zeros if needed (ensure 2 digits minimum)
    lesson_num = lesson_num.zfill(2)
    
    book_name = get_book_name(book_id)
    return f"{book_name}_{lesson_num}"

def extract_lesson_id(lesson_info: str) -> str:
    """Extract or generate lesson ID"""
    # Try to extract existing ID
    if 'lesson_id=' in lesson_info:
        match = re.search(r'lesson_id=(\d+)', lesson_info)
        if match:
            return match.group(1)
    
    # Extract from URL if present
    url_match = re.search(r'lesson_id[=/](\d+)', lesson_info)
    if url_match:
        return url_match.group(1)
    
    # Generate from lesson number
    lesson_numbers = re.findall(r'\d+', lesson_info)
    if lesson_numbers:
        # Use a base number + lesson number to generate unique IDs
        base_id = 300  # Adjust based on your system
        return str(base_id + int(lesson_numbers[0]))
    
    return "301"  # Default fallback
```

### 4. Part of Speech Normalization

```python
def normalize_part_of_speech(pos: str) -> str:
    """
    Normalize part of speech to match website expectations
    The website uses these specific categories with color coding:
    - '名词' (noun)
    - '动词' (verb) 
    - '形容词' (adjective)
    - '惯用语' (idiom)
    - '副词' (adverb)
    """
    if not pos:
        return '名词'  # Default to noun
    
    pos_mapping = {
        # Noun variations
        '名': '名词',
        'noun': '名词',
        'n': '名词',
        '名詞': '名词',
        
        # Verb variations
        '动': '动词',
        'verb': '动词',
        'v': '动词',
        '動詞': '动词',
        '动1': '动词',  # Group 1 verb
        '动2': '动词',  # Group 2 verb
        '动3': '动词',  # Group 3 verb
        
        # Adjective variations
        '形': '形容词',
        'adjective': '形容词',
        'adj': '形容词',
        '形容詞': '形容词',
        'い形容词': '形容词',
        'な形容词': '形容词',
        
        # Adverb variations
        '副': '副词',
        'adverb': '副词',
        'adv': '副词',
        '副詞': '副词',
        
        # Idiom/phrase variations
        '惯用语': '惯用语',
        '慣用語': '惯用语',
        'phrase': '惯用语',
        'idiom': '惯用语',
        '短语': '惯用语',
        
        # Other common types
        '代词': '代词',
        '连词': '连词',
        '介词': '介词',
        '数词': '数词',
        '感叹词': '感叹词'
    }
    
    # Normalize input
    normalized = clean_text(pos).lower()
    
    # Try exact matches
    for key, value in pos_mapping.items():
        if key.lower() == normalized or key.lower() in normalized:
            return value
    
    # Return original if no mapping found, but cleaned
    return clean_text(pos) if clean_text(pos) else '名词'

def detect_verb_group(pos: str, japanese_word: str) -> Optional[str]:
    """
    Detect verb group for conjugation purposes
    Returns '动1', '动2', or '动3' for verb classification
    """
    if '动' not in pos and 'verb' not in pos.lower():
        return None
    
    # Group 3 (irregular) verbs - specific list
    group3_verbs = {'する', 'くる', '来る', 'いく', '行く'}
    
    if japanese_word in group3_verbs:
        return '动3'
    
    # Group 2 (ichidan) verbs - end in る with specific stems
    if japanese_word.endswith('る'):
        # Check if stem ends in i/e sound (simplified check)
        stem = japanese_word[:-1]
        if stem and stem[-1] in 'いえきしちにひみりけせてねへめれげぜでべぺ':
            return '动2'
    
    # Default to Group 1 (godan) for other verbs
    return '动1'
```

### 5. Example Sentence Processing

```python
def process_example_sentences(sentences: Any) -> List[str]:
    """
    Process and clean example sentences
    Ensures proper formatting and removes empty entries
    """
    if not sentences:
        return []
    
    # Handle different input types
    if isinstance(sentences, str):
        # Split on common delimiters
        sentences = re.split(r'[;。\n]', sentences)
    
    if not isinstance(sentences, list):
        return []
    
    processed = []
    for sentence in sentences:
        if not sentence:
            continue
            
        # Clean the sentence
        cleaned = clean_text(str(sentence))
        
        # Skip empty or too short sentences
        if len(cleaned.strip()) < 3:
            continue
            
        # Remove redundant parts if present
        cleaned = re.sub(r'^[\d\s]*[\.、]?\s*', '', cleaned)
        
        if cleaned.strip():
            processed.append(cleaned.strip())
    
    return processed[:5]  # Limit to 5 examples to prevent bloat
```

### 6. Verb Conjugation Generation

```python
def is_verb(part_of_speech: str) -> bool:
    """Check if the part of speech indicates a verb"""
    return '动' in part_of_speech or 'verb' in part_of_speech.lower()

def generate_sample_conjugations(japanese_word: str, verb_group: str) -> Dict[str, str]:
    """
    Generate sample conjugations for verbs
    This is a simplified implementation - you may want to use a proper Japanese conjugation library
    """
    if not is_verb(verb_group):
        return {}
    
    # This is a simplified example - for production use, consider:
    # - pykakasi for romaji conversion
    # - jamdict or similar for proper conjugation rules
    # - Manual lookup tables for irregular verbs
    
    base_conjugations = {
        'polite_present': f'{japanese_word}',  # Will need proper ます form
        'polite_past': f'{japanese_word[:-1]}ました',  # Simplified
        'polite_negative': f'{japanese_word[:-1]}ません',  # Simplified
        'polite_past_negative': f'{japanese_word[:-1]}ませんでした',  # Simplified
        'casual_present': japanese_word,
        'casual_past': f'{japanese_word[:-1]}た',  # Very simplified
        'casual_negative': f'{japanese_word[:-1]}ない',  # Very simplified
        'casual_past_negative': f'{japanese_word[:-1]}なかった',  # Very simplified
        'te_form': f'{japanese_word[:-1]}て',  # Very simplified
        'potential': f'{japanese_word[:-1]}れる',  # Very simplified
        'passive': f'{japanese_word[:-1]}れる',  # Very simplified
        'causative': f'{japanese_word[:-1]}せる',  # Very simplified
        'imperative': f'{japanese_word[:-1]}ろ',  # Very simplified
        'conditional': f'{japanese_word[:-1]}れば',  # Very simplified
        'volitional': f'{japanese_word[:-1]}よう',  # Very simplified
    }
    
    # Note: This is extremely simplified. For production use, implement proper
    # Japanese conjugation rules or use an existing library
    return base_conjugations
```

### 7. Main Post-Processing Pipeline

```python
def post_process_vocabulary_item(raw_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Main post-processing function for a single vocabulary item
    Returns None if the item should be skipped
    """
    # Validate required fields
    if not validate_required_fields(raw_item):
        print(f"Skipping item with missing required fields: {raw_item}")
        return None
    
    # Extract and clean basic information
    book_id = map_book_id(raw_item.get('book_info', ''))
    lesson_name = normalize_lesson_name(raw_item.get('lesson_name', ''), book_id)
    lesson_id = extract_lesson_id(raw_item.get('lesson_info', lesson_name))
    
    # Process text fields
    japanese_word = clean_text(raw_item.get('japanese_word', ''))
    reading = clean_text(raw_item.get('reading', japanese_word))  # Default to japanese_word if no reading
    chinese_meaning = clean_text(raw_item.get('chinese_meaning', ''))
    
    # Process part of speech
    part_of_speech = normalize_part_of_speech(raw_item.get('part_of_speech', ''))
    verb_group = detect_verb_group(part_of_speech, japanese_word)
    if verb_group:
        part_of_speech = verb_group  # Use specific verb group
    
    # Process example sentences
    example_sentences = process_example_sentences(raw_item.get('example_sentences', []))
    
    # Build the processed item
    processed_item = {
        '_id': raw_item.get('_id') or generate_uuid(),
        'book_id': book_id,
        'lesson_id': lesson_id,
        'lesson_name': lesson_name,
        'lesson_url': clean_text(raw_item.get('lesson_url', '')),
        'word_number': str(raw_item.get('word_number', '1')),
        'japanese_word': japanese_word,
        'reading': reading,
        'pronunciation_url': raw_item.get('pronunciation_url'),  # Can be None
        'chinese_meaning': chinese_meaning,
        'part_of_speech': part_of_speech,
        'example_sentences': example_sentences,
        'page_url': clean_text(raw_item.get('page_url', '')),
        'scraped_at': datetime.now().isoformat()
    }
    
    # Add conjugations for verbs
    if is_verb(part_of_speech):
        conjugations = generate_sample_conjugations(japanese_word, part_of_speech)
        if conjugations:
            processed_item['conjugations'] = conjugations
    
    return processed_item

def post_process_vocabulary_dataset(raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Process an entire vocabulary dataset
    """
    processed_items = []
    
    for i, item in enumerate(raw_data):
        try:
            processed = post_process_vocabulary_item(item)
            if processed:
                processed_items.append(processed)
            else:
                print(f"Skipped item {i}: validation failed")
        except Exception as e:
            print(f"Error processing item {i}: {e}")
            continue
    
    print(f"Successfully processed {len(processed_items)} out of {len(raw_data)} items")
    return processed_items
```

### 8. Quality Assurance and Validation

```python
def validate_processed_dataset(processed_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate the processed dataset and return quality metrics
    """
    validation_report = {
        'total_items': len(processed_data),
        'verb_count': 0,
        'books': set(),
        'lessons': set(),
        'parts_of_speech': set(),
        'items_with_examples': 0,
        'items_with_conjugations': 0,
        'validation_errors': []
    }
    
    for i, item in enumerate(processed_data):
        try:
            # Basic validation
            if not item.get('_id') or not item.get('japanese_word'):
                validation_report['validation_errors'].append(f"Item {i}: Missing ID or Japanese word")
            
            # Track statistics
            validation_report['books'].add(item.get('book_id', 'unknown'))
            validation_report['lessons'].add(item.get('lesson_name', 'unknown'))
            validation_report['parts_of_speech'].add(item.get('part_of_speech', 'unknown'))
            
            if is_verb(item.get('part_of_speech', '')):
                validation_report['verb_count'] += 1
            
            if item.get('example_sentences') and len(item['example_sentences']) > 0:
                validation_report['items_with_examples'] += 1
            
            if item.get('conjugations'):
                validation_report['items_with_conjugations'] += 1
                
        except Exception as e:
            validation_report['validation_errors'].append(f"Item {i}: Validation error - {e}")
    
    # Convert sets to lists for JSON serialization
    validation_report['books'] = sorted(list(validation_report['books']))
    validation_report['lessons'] = sorted(list(validation_report['lessons']))
    validation_report['parts_of_speech'] = sorted(list(validation_report['parts_of_speech']))
    
    return validation_report

def print_validation_report(report: Dict[str, Any]):
    """Print a human-readable validation report"""
    print("\n" + "="*50)
    print("VOCABULARY DATASET VALIDATION REPORT")
    print("="*50)
    print(f"Total Items: {report['total_items']}")
    print(f"Verbs: {report['verb_count']}")
    print(f"Items with Examples: {report['items_with_examples']}")
    print(f"Items with Conjugations: {report['items_with_conjugations']}")
    print(f"\nBooks: {', '.join(report['books'])}")
    print(f"Parts of Speech: {', '.join(report['parts_of_speech'])}")
    print(f"Total Lessons: {len(report['lessons'])}")
    
    if report['validation_errors']:
        print(f"\nValidation Errors ({len(report['validation_errors'])}):")
        for error in report['validation_errors'][:10]:  # Show first 10 errors
            print(f"  - {error}")
        if len(report['validation_errors']) > 10:
            print(f"  ... and {len(report['validation_errors']) - 10} more errors")
    else:
        print("\n✅ No validation errors found!")
    print("="*50)
```

### 9. Usage Example

```python
import json

def main():
    """Example usage of the post-processing pipeline"""
    
    # Load raw scraped data
    with open('raw_vocabulary_data.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f"Loaded {len(raw_data)} raw vocabulary items")
    
    # Apply post-processing
    processed_data = post_process_vocabulary_dataset(raw_data)
    
    # Validate results
    validation_report = validate_processed_dataset(processed_data)
    print_validation_report(validation_report)
    
    # Save processed data
    with open('vocabulary.json', 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Processed data saved to vocabulary.json")
    print(f"Ready to be used by the Next.js application!")

if __name__ == "__main__":
    main()
```

## Expected Output Format

The final JSON should look like this:

```json
[
  {
    "_id": "0fc84970-f720-4c3c-a912-36658bf057a0",
    "book_id": "7",
    "lesson_id": "321",
    "lesson_name": "新标初_34",
    "lesson_url": "http://jp.qsbdc.com/jpword/word_list.php?lesson_id=321",
    "word_number": "1",
    "japanese_word": "カレンダー",
    "reading": "カレンダー",
    "pronunciation_url": null,
    "chinese_meaning": "挂历，日历",
    "part_of_speech": "名词",
    "example_sentences": [
      "卓上カレンダー / 台历。",
      "園芸カレンダー / 农艺全年行事表。"
    ],
    "page_url": "http://jp.qsbdc.com/jpword/word_list.php?lesson_id=321",
    "scraped_at": "2025-07-13T21:07:06.313233"
  }
]
```

## Required Python Dependencies

```bash
pip install uuid re datetime typing
```

For advanced Japanese processing (recommended):
```bash
pip install pykakasi jamdict mecab-python3
```

## Notes for Implementation

1. **Verb Conjugation**: The simplified conjugation generation above is basic. For production use, consider using a proper Japanese NLP library or maintaining lookup tables for common verbs.

2. **Text Cleaning**: Adjust the `clean_text` function based on the specific issues you encounter in your scraped data.

3. **Book ID Mapping**: Update the mapping logic based on how your scraper identifies different textbook series.

4. **Error Handling**: The pipeline includes comprehensive error handling to ensure the scraper doesn't crash on malformed data.

5. **Performance**: For large datasets, consider using pandas or implementing batch processing.

6. **Validation**: The validation functions help ensure data quality before the final export.

This post-processing pipeline will ensure your Python scraper outputs data that is immediately compatible with the Next.js vocabulary learning application without requiring any additional transformation steps.
