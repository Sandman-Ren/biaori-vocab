import {VOCABULARY} from "@/app/data/vocabulary";

export default function Home() {
    return <div>
        <h1>biaori works!</h1>
        <pre>{JSON.stringify(VOCABULARY.slice(0, 10), null, 2)}</pre>
    </div>;
}
