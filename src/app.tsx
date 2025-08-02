import "./app.css"
import { Map } from "./map.tsx";
import { useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStations } from "./stations.ts";
import { Sidebar } from "./sidebar.tsx";

export function App() {
    const [st, setSt] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const stations = useStations();

    return (
        <div class="container">
            <TopBar/>

            <div class="mapAndSidebar">
                {stations !== null && <>
                    <Sidebar open={open} stations={stations} selectedStation={st} />
                    <Map setSt={setSt} stations={stations} setSidebarOpen={setOpen}/>
                </>}
            </div>
        </div>
    );
}
