import VocabularyDatabase from '@/components/vocabulary-database';
import { VocabularyItem } from '@/lib/types';
import fs from 'fs';
import path from 'path';

async function getVocabularyData(): Promise<VocabularyItem[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'vocabulary.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const vocabulary = await getVocabularyData();

  return <VocabularyDatabase vocabulary={vocabulary} />;
}
