import "./app.css"
import { Map } from "./map.tsx";
import { useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStationsData } from "./stations.ts";
import { Sidebar } from "./sidebar.tsx";

export function App() {
    const [st, setSt] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const stationsData = useStationsData();

    return (
        <div class="container">
            <TopBar/>

            <div class="mapAndSidebar">
                {stationsData !== null && <>
                    <Sidebar open={open} data={stationsData} selectedStation={st} />
                    <Map setSt={setSt} data={stationsData} setSidebarOpen={setOpen}/>
                </>}
            </div>
        </div>
    );
}
