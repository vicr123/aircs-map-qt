import "./sidebar.css";
import { StationInfo } from "./station-info";
import type { StationsData } from "./stations";

export type Display =
    | { type: "station"; selected: string }
    | { type: "directions"; route: string[] };

export function Sidebar({
    data,
    display,
}: {
    data: StationsData;
    display: Display | null;
}) {
    let child = null;
    if (display === null) {
        return <div class="sidebar closed" />;
    } else if (
        display.type === "station" &&
        display.selected in data.stations
    ) {
        child = <StationInfo data={data} selectedStation={display.selected} />;
    } else if (display.type === "directions") {
        child = display.route.map((x) => <p>{x}</p>);
    }
    return (
        <div class="sidebar open">
            <div class="sidebarContainer">{child}</div>
        </div>
    );
}
