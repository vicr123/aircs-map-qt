import { type StateUpdater } from "preact/hooks";
import "./sidebar.css";
import { StationInfo } from "./station-info";
import { Route } from "./route";

export type Display =
    | { type: "station"; selected: string }
    | { type: "directions"; route: string[] };

export function Sidebar({
    display,
    setDisplay,
    setFocused,
    focused,
}: {
    display: Display | null;
    setDisplay: (d: StateUpdater<Display | null>) => void;
    setFocused: (s: StateUpdater<number>) => void;
    focused: number;
}) {
    let child = null;
    if (display === null) {
        return <div class="sidebar closed" />;
    } else if (display.type === "station") {
        child = <StationInfo selectedStation={display.selected} />;
    } else if (display.type === "directions") {
        child = (
            <Route
                route={display.route}
                setRoute={(r) => setDisplay({ ...display, route: r })}
                setFocused={setFocused}
                focused={focused}
            />
        );
    }

    return (
        <div class="sidebar open">
            <div class="sidebarContainer">{child}</div>
        </div>
    );
}
