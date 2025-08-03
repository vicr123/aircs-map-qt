import "./sidebar.css";
import { StationInfo } from "./station-info";
import type { StationsData } from "./stations";

export function Sidebar({
    open,
    data,
    selectedStation,
}: {
    open: boolean;
    data: StationsData;
    selectedStation: string | null;
}) {
    let child = null;
    if (selectedStation !== null && selectedStation in data.stations) {
        child = <StationInfo data={data} selectedStation={selectedStation} />;
    }
    return (
        <div class={open ? "sidebar open" : "sidebar closed"}>
            <div class="sidebarContainer">{child}</div>
        </div>
    );
}
