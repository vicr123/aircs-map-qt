import "./directions.css";
import {
    useCallback,
    useContext,
    useMemo,
    type StateUpdater,
} from "preact/hooks";
import { eta, StationsDataContext, type StationsData } from "./stations";

export function Directions({
    setFocused,
    setRoute,
    route,
    focused,
}: {
    setFocused: (s: StateUpdater<number>) => void;
    route: string[];
    setRoute: (s: string[]) => void;
    focused: number;
}) {
    const data = useContext(StationsDataContext);

    const addAnotherStop = useCallback(() => setRoute([...route, ""]), [route]);
    const xButton = useCallback(
        (i: number) => {
            const val = [...route];
            val.splice(i, 1);

            setRoute(val);
        },
        [route],
    );

    const path = useMemo(() => findPathThrough(route, data), [route, data]);

    return (
        <>
            <h1 class="sidebarTitle">Get Directions</h1>
            <div class="route">
                {route.map((x, i) => (
                    <div class="routeInputs">
                        <input
                            class={i === focused ? "focused" : ""}
                            onFocus={() => setFocused(i)}
                            value={x}
                            list="stationsDatalist"
                        ></input>
                        {i >= 2 && (
                            <button onClick={() => xButton(i)}>❌</button>
                        )}
                    </div>
                ))}
                <button onClick={addAnotherStop}>Add another stop</button>
            </div>
            <div class="path">
                <Path path={path} />
            </div>
        </>
    );
}

function Path({ path }: { path: Path[] }) {
    if (path.length === 0) return null;

    return (
        <ol>
            {path.map((a) => (
                <PathEl el={a} />
            ))}
        </ol>
    );
}

function PathEl({ el }: { el: Path }) {
    const data = useContext(StationsDataContext);
    const infos = [
        el.via === null ? "Arrive at destination" : `Take Platform ${el.via}`,
    ];
    if (el.blocks !== 0) {
        infos.push(`ETA: ${eta(el.blocks)}`);
    }
    return (
        <li>
            <div class="pathElement">
                <span class="pathStation">{data.stations[el.station].name}</span>
                {infos.join(" ∙ ")}
            </div>
        </li>
    );
}

interface Path {
    station: string;
    blocks: number;
    via: string | null;
}

function findPathThrough(stations: string[], data: StationsData): Path[] {
    const path = [];
    for (let i = 0; i < stations.length - 1; i++) {
        const startId = stations[i];
        const endId = stations[i + 1];
        if (!(startId in data.stations && endId in data.stations)) {
            break;
        }

        path.push(dijkstra(startId, endId, data));
    }
    if (path.length === 0) {
        return [];
    }
    return path.reduce((acc, curr) => {
        const last = acc[acc.length - 1];

        const startDist = last.blocks;

        return acc.concat(
            curr.map((x) => ({ ...x, blocks: x.blocks + startDist })).slice(1),
        );
    });
}

function dijkstra(from: string, to: string, data: StationsData): Path[] {
    const nodes = new Map<
        string,
        {
            dist: number;
            previous: string | null;
            visited: boolean;
            via: string | null;
        }
    >();
    for (const vertex of Object.keys(data.stations)) {
        nodes.set(vertex, {
            dist: Infinity,
            previous: null,
            visited: false,
            via: null,
        });
    }
    nodes.get(from)!.dist = 0;

    while (nodes.size !== 0) {
        let current: string = undefined!;
        let currentDist = Infinity;
        for (const [id, node] of nodes.entries()) {
            if (!node.visited && node.dist < currentDist) {
                currentDist = node.dist;
                current = id;
            }
        }

        if (currentDist === Infinity || current === to) {
            break;
        }

        for (const [via, platform] of Object.entries(
            data.stations[current].platforms,
        )) {
            const neighbor = nodes.get(platform.station)!;
            if (neighbor.visited) continue;

            const newDist = platform.blocks + currentDist;
            if (newDist < neighbor.dist) {
                neighbor.dist = newDist;
                neighbor.previous = current;
                neighbor.via = via;
            }
        }

        nodes.get(current)!.visited = true;
    }

    const path: Path[] = [];
    if (nodes.get(to)?.previous !== null) {
        let x: string | null = to;
        let via: string | null = null;
        while (x !== null) {
            const xNode = nodes.get(x);
            path.push({ station: x, blocks: xNode!.dist, via: via });
            via = xNode!.via;
            x = xNode!.previous;
        }
    }
    path.reverse();
    return path;
}
