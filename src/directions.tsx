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

    const addAnotherStop = useCallback(() => {
        setRoute([...route, ""]);
        setFocused(route.length);
    }, [route]);

    const xButton = useCallback(
        (i: number) => {
            const val = [...route];
            val.splice(i, 1);

            setRoute(val);
        },
        [route],
    );

    const textBoxOnChange = useCallback(
        (e: Event, i: number) => {
            const val = (e.target as HTMLInputElement).value;
            const newRoute = [...route];
            newRoute[i] = val;
            setRoute(newRoute);
        },
        [route],
    );

    const paths = useMemo(() => findPathThrough(route, data), [route, data]);

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
                            onChange={(e) => {
                                textBoxOnChange(e, i);
                            }}
                            list="stationsDatalist"
                        ></input>
                        {i >= 2 && (
                            <button onClick={() => xButton(i)} aria-description="Delete">🗙</button>
                        )}
                    </div>
                ))}
                <button onClick={addAnotherStop}>Add another stop</button>
            </div>
            <div class="path">
                {paths.map((path, index) => (
                    <Path path={path} isLastLeg={index === paths.length - 1} />
                ))}
            </div>
        </>
    );
}

function Path({ path, isLastLeg }: { path: Path[]; isLastLeg: boolean }) {
    if (path.length === 0) return null;

    return (
        <ol class="pathList">
            {path.map((a, i) => (
                <PathEl
                    el={a}
                    isLastInPath={i === path.length - 1}
                    isLastLeg={isLastLeg}
                />
            ))}
        </ol>
    );
}

function PathEl({
    el,
    isLastInPath,
    isLastLeg,
}: {
    el: Path;
    isLastInPath: boolean;
    isLastLeg: boolean;
}) {
    const data = useContext(StationsDataContext);

    const infos = [];

    if (isLastInPath) {
        infos.push(isLastLeg ? "Arrive at destination" : "Arrive at waypoint");
    } else {
        infos.push(`Take Platform ${el.via}`);
    }

    if (isLastInPath) {
        infos.push(`Total leg time: ${eta(el.accumulatedBlocks)}`);
    } else {
        infos.push(`ETA: ${eta(el.blocks)}`);
    }

    return (
        <li class="pathListItem">
            <div class="pathElement">
                <span class="pathStation">
                    {data.stations[el.station].name}
                </span>
                {infos.join(" ∙ ")}
            </div>
        </li>
    );
}

interface Path {
    station: string;
    accumulatedBlocks: number;
    blocks: number;
    via: string | null;
}

function findPathThrough(stations: string[], data: StationsData): Path[][] {
    const paths = [];
    for (let i = 0; i < stations.length - 1; i++) {
        const startId = stations[i];
        const endId = stations[i + 1];
        if (!(startId in data.stations && endId in data.stations)) {
            break;
        }

        paths.push(dijkstra(startId, endId, data));
    }

    return paths;
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
        let dist = 0;
        while (x !== null) {
            const xNode = nodes.get(x);
            if (xNode === undefined) throw new Error("get failed");

            path.push({
                station: x,
                accumulatedBlocks: xNode.dist,
                blocks: dist - xNode.dist,
                via: via,
            });
            via = xNode.via;
            dist = xNode.dist;
            x = xNode.previous;
        }
    }
    path.reverse();
    return path;
}
