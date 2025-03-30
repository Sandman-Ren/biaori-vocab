'use client';
import dynamic from 'next/dynamic';

const VocabularyDataTable = dynamic(
    () => import('@/app/components/VocabularyDataTable').then((mod) => mod.VocabularyDataTable),
    { ssr: false }
  );
  
export default function Home() {
    return <div
        className="
            h-full w-full max-h-full max-w-full
            px-4
        flex flex-col items-center justify-center
        "
    >
        <div
            className="flex-auto"
        >
            <VocabularyDataTable/>
        </div>
    </div>;
}
