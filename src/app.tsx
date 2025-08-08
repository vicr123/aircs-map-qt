import "./app.css";
import { SvgMap } from "./map.tsx";
import { useCallback, useState } from "preact/hooks";
import { TopBar } from "./top-bar.tsx";
import { StationsDataContext, type StationsData } from "./stations.ts";
import { type Display, Sidebar } from "./sidebar.tsx";
import { StationsDatalist } from "./stations-datalist.tsx";

export function App({ stationsData }: { stationsData: StationsData }) {
    const [rememberRoute, setRememberRoute] = useState<string[]>(["", ""]);
    const [sidebar, setSidebar] = useState<Display | null>(null);
    const [focused, setFocused] = useState<number>(0);

    const onStationClick = useCallback(
        (id: string | null) => {
            if (id === null) {
                if (sidebar?.type === "directions") {
                    setRememberRoute(sidebar.route);
                }
                setSidebar(null);
            } else if (sidebar !== null && sidebar.type === "directions") {
                if (focused < sidebar.route.length) {
                    const route = [...sidebar.route];
                    route[focused] = id;
                    setFocused((focused) =>
                        Math.min(focused + 1, route.length - 1),
                    );
                    setSidebar({ type: "directions", route });
                }
            } else {
                setSidebar({ type: "station", selected: id });
            }
        },
        [sidebar, focused],
    );

    const onFromTo = useCallback(
        (station: string, index: number) => {
            const route =
                sidebar?.type === "directions" ? [...sidebar.route] : ["", ""];
            route[index] = station;
            setSidebar({ type: "directions", route });
            setFocused((focused) => Math.min(focused + 1, route.length - 1));
        },
        [sidebar, focused],
    );

    const onGetDirection = () => {
        setSidebar({ type: "directions", route: rememberRoute });
        setFocused(0);
    };

    const onTopbarStationSet = (x: string) => {
        setSidebar({ type: "station", selected: x });
    };

    return (
        <StationsDataContext value={stationsData}>
            <div class="container">
                <TopBar
                    onGetDirection={onGetDirection}
                    onStationSet={onTopbarStationSet}
                />

                <div class="mapAndSidebar">
                    <Sidebar
                        display={sidebar}
                        setDisplay={setSidebar}
                        focused={focused}
                        setFocused={setFocused}
                    />
                    <SvgMap
                        onStationClick={onStationClick}
                        onFromStation={(s) => onFromTo(s, 0)}
                        onToStation={(s) => onFromTo(s, 1)}
                    />
                </div>
            </div>

            <StationsDatalist id="stationsDatalist" />
        </StationsDataContext>
    );
}
