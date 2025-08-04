import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "preact/hooks";
import { StationsDataContext, type StationsData } from "./stations";
import "./map.css";
import type { RefObject } from "preact";

export function SvgMap({
    onStationClick,
}: {
    onStationClick: (s: string | null) => void;
}) {
    const [pan, setPan] = useState([0, 0]);
    const [scale, setScale] = useState(5);
    const [isPanning, setIsPanning] = useState(false);
    const distancePanned = useRef(0);
    const clickedStation = useRef(false);
    const data = useContext(StationsDataContext);

    const handleMouseDown = () => {
        setIsPanning(true);
        distancePanned.current = 0;
        clickedStation.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) {
            return;
        }
        setPan((prevPan) => [
            prevPan[0] + e.movementX,
            prevPan[1] + e.movementY,
        ]);
        distancePanned.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    };

    const handleMouseUp = (_e: MouseEvent) => {
        setIsPanning(false);
    };

    const handleClick = useCallback(() => {
        if (!clickedStation.current && distancePanned.current < 10) {
            onStationClick(null);
        }
    }, [onStationClick]);

    const onNodeClicked = useRef((_e: MouseEvent, _s: string) => {});

    useEffect(() => {
        onNodeClicked.current = (_e: MouseEvent, str: string) => {
            if (distancePanned.current > 10) {
                return;
            }
            clickedStation.current = true;
            onStationClick(str);
        };
    }, [onStationClick]);

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = (e.currentTarget as Element)!.getBoundingClientRect();
        const scaleFactor = e.ctrlKey ? 0.01 : 0.001;

        let newScale = scale * Math.exp(-e.deltaY * scaleFactor * window.devicePixelRatio);
        if (newScale < 1) {
            newScale = 1;
        } else if (newScale > 20) {
            newScale = 20;
        }

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan[0]) / scale;
        const worldY = (mouseY - pan[1]) / scale;

        const newPanX = mouseX - worldX * newScale;
        const newPanY = mouseY - worldY * newScale;

        setScale(newScale);
        setPan([newPanX, newPanY]);
    };

    const svg = useMemo(
        () => <Svg onNodeClicked={onNodeClicked} data={data} />,
        [],
    );
    return (
        <main
            class="mapContainer"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
        >
            <div
                class="positionMap"
                children={svg}
                style={{
                    left: `${pan[0]}px`,
                    top: `${pan[1]}px`,
                    transform: `scale(${scale})`,
                    cursor: isPanning ? "grabbing" : "unset",
                }}
            />
        </main>
    );
}

function Svg({
    onNodeClicked,
    data,
}: {
    onNodeClicked: RefObject<(e: MouseEvent, s: string) => void>;
    data: StationsData;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        (async () => {
            const req = await fetch("/map.svg");
            const data = await req.text();
            const parse = new DOMParser().parseFromString(
                data,
                "image/svg+xml",
            ) as XMLDocument;

            if (parse.firstElementChild instanceof SVGSVGElement) {
                return parse.firstElementChild;
            }
            throw new Error("Failed to parse image");
        })().then((svg) => {
            if (divRef.current === null) {
                throw new Error("null div");
            }

            const layer1 = svg.getElementById("layer1")!;
            for (const child of [...layer1.children]) {
                if (child.id !== "map") {
                    layer1.removeChild(child);
                }
            }

            for (const id of Object.keys(data.stations)) {
                const el = svg.getElementById(id);
                if (!(el instanceof SVGGElement)) {
                    continue;
                }
                el.style.cursor = "pointer";
                el.addEventListener("click", (e) =>
                    onNodeClicked.current!(e as MouseEvent, id),
                );
            }

            if (divRef.current.firstElementChild !== null) {
                divRef.current.firstElementChild.replaceWith(svg);
            } else {
                divRef.current!.appendChild(svg);
            }
        });

        return () => {
            console.warn("I shouldn't be unmounted!");
        };
    });

    return <div ref={divRef} />;
}
