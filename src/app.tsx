import "./app.css"
import { Map } from "./map.tsx";
import { useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStations } from "./stations.ts";

export function App() {
    const [st, setSt] = useState<string>("");
    const [open, setOpen] = useState(false);
    const stations = useStations();

    return (
        <div class="container">
            <TopBar st={st}/>
            <div onClick={() => setOpen(!open)}>#####################################</div>
            <div class="mapAndSidebar">
                <div class={`sidebar ${!open ? "closed" : "open"}`}>
                    Konqi is coming for you.
                </div>
                {stations !== null && <Map setSt={setSt} stations={stations} />}
            </div>
        </div>
    );
}
