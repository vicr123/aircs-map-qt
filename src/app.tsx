import "./app.css"
import { Map } from "./map.tsx";
import { useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStations } from "./stations.ts";
import { Sidebar } from "./sidebar.tsx";

export function App() {
    const [st, setSt] = useState<string>("");
    const [open, setOpen] = useState(false);
    const stations = useStations();

    return (
        <div class="container">
            <TopBar st={st} onGetDir={() => setOpen(!open)}/>

            <div class="mapAndSidebar">
                <Sidebar open={open}/>
                {stations !== null && <Map setSt={setSt} stations={stations} />}
            </div>
        </div>
    );
}
