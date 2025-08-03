import { type StateUpdater } from "preact/hooks";
import "./sidebar.css";
import { StationInfo } from "./station-info";
import { Route } from "./route";

export type Display =
    | { type: "station"; selected: string }
    | { type: "directions"; route: string[] };

export function Sidebar({
    display,
    setFocused,
    focused,
}: {
    display: Display | null;
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
