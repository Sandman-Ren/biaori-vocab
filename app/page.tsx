import {VocabularyDataTable} from "@/app/components/VocabularyDataTable";

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
