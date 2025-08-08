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
import { openContextMenu } from "preact-context-menu";
import { MapContextMenu } from "./map-context-menu.tsx";

function fingerDistance(touches: TouchList) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getCenter(touches: TouchList) {
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return [x, y] as const;
}

export function SvgMap({
    onStationClick,
    onFromStation,
    onToStation,
}: {
    onStationClick: (s: string | null) => void;
    onFromStation: (s: string) => void;
    onToStation: (s: string) => void;
}) {
    const [pan, setPan] = useState<readonly [number, number]>([0, 0]);
    const [scale, setScale] = useState(5);
    const [isPanning, setIsPanning] = useState(false);
    const [isPinching, setIsPinching] = useState(false);

    const distancePanned = useRef(0);
    const clickedStation = useRef(false);

    const lastTouchPosition = useRef<readonly [number, number]>([0, 0]);

    const initialDistance = useRef(0);
    const lastScale = useRef(1);
    const pinchCenter = useRef<readonly [number, number]>([0, 0]);

    const updatePan = (movementX: number, movementY: number) => {
        setPan((prevPan) => [prevPan[0] + movementX, prevPan[1] + movementY]);
        distancePanned.current += Math.abs(movementX) + Math.abs(movementY);
    };

    const handleMouseDown = () => {
        setIsPanning(true);
        distancePanned.current = 0;
        clickedStation.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) {
            return;
        }
        updatePan(e.movementX, e.movementY);
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = (e.currentTarget as Element)!.getBoundingClientRect();
        const scaleFactor = e.ctrlKey ? 0.01 : 0.001;

        let newScale =
            scale * Math.exp(-e.deltaY * scaleFactor * window.devicePixelRatio);
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

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
            setIsPinching(true);
            setIsPanning(false);
            initialDistance.current = fingerDistance(e.touches);
            lastScale.current = scale;
            pinchCenter.current = getCenter(e.touches);
            return;
        } else if (e.touches.length === 1) {
            setIsPinching(false);
            setIsPanning(true);
            distancePanned.current = 0;
            const touch = e.touches[0];
            lastTouchPosition.current = [touch.clientX, touch.clientY];
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (isPinching && e.touches.length === 2) {
            const distance = fingerDistance(e.touches);
            const zoom = distance / initialDistance.current;
            let newScale = lastScale.current * zoom;
            if (newScale < 1) {
                newScale = 1;
            } else if (newScale > 20) {
                newScale = 20;
            }
            setScale(newScale);

            const [centerX, centerY] = pinchCenter.current;
            const newPanX = centerX - (centerX - pan[0]) * (newScale / scale);
            const newPanY = centerY - (centerY - pan[1]) * (newScale / scale);
            setPan([newPanX, newPanY]);
        } else if (isPanning && e.touches.length === 1) {
            const touch = e.touches[0];
            const movementX = touch.clientX - lastTouchPosition.current[0];
            const movementY = touch.clientY - lastTouchPosition.current[1];
            lastTouchPosition.current = [touch.clientX, touch.clientY];
            updatePan(movementX, movementY);
        } else {
            handleTouchStart(e);
        }
    };

    const handleTouchEnd = () => {
        setIsPanning(false);
        setIsPinching(false);
        lastScale.current = scale;
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
    }, [onStationClick]); // Evil schmevil: reassigning all the events, every time, seems much worse than doing this.

    const data = useContext(StationsDataContext);
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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

            <MapContextMenu
                id="mapContext"
                onFromHere={onFromStation}
                onToHere={onToStation}
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

                el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    openContextMenu("mapContext", id, e);
                });
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
