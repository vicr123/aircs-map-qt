import "./route.css";
import { useContext, type StateUpdater } from "preact/hooks";
import { StationsDataContext } from "./stations";

export function Route({
    setFocused,
    route,
    focused,
}: {
    setFocused: (s: StateUpdater<number>) => void;
    route: string[];
    focused: number;
}) {
    const data = useContext(StationsDataContext);
    return route.map((x, i) => (
        <input
            class={i === focused ? "focused" : ""}
            onFocus={() => setFocused(i)}
            value={x}
            list="stationsDatalist"
        ></input>
    ));
}
