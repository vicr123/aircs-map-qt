import "./app.css";
import { SvgMap } from "./map.tsx";
import { useCallback, useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { useStationsData } from "./stations.ts";
import { type Display, Sidebar } from "./sidebar.tsx";

export function App() {
    const [sidebar, setSidebar] = useState<Display | null>(() => null);

    const onStationClick = useCallback((id: string | null) => {
        console.log(sidebar);
        if (id === null) {
            setSidebar(null);
        } else if (sidebar !== null && sidebar.type === "directions") {
            const route = [...sidebar.route, id];
            setSidebar({ type: "directions", route });
        } else {
            setSidebar({ type: "station", selected: id });
        }
    }, [sidebar]);

    const onGetDirection = () => {
        setSidebar({ type: "directions", route: [] });
    };

    const stationsData = useStationsData();

    return (
        <div class="container">
            <TopBar onGetDirection={onGetDirection} />

            <div class="mapAndSidebar">
                {stationsData !== null && (
                    <>
                        <Sidebar display={sidebar} data={stationsData} />
                        <SvgMap
                            data={stationsData}
                            onStationClick={onStationClick}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
