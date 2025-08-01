import "./app.css"
import { Map } from "./map.tsx";
import { useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStations } from "./stations.ts";

export function App() {
    const [st, setSt] = useState<string>("");
    const stations = useStations();

    return (
        <div class="container">
            <TopBar st={st} />

            <div class="mainContainer">
                {stations !== null && <Map setSt={setSt} stations={stations} />}
            </div>
        </div>
    );
}
