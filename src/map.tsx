import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Stations } from "./stations";
import "./map.css"

export function Map({ setSt, stations }: { setSt: (s: string) => void, stations: Stations }) {
    const [pan, setPan] = useState([0, 0]);
    const [scale, setScale] = useState(5);
    const [isPanning, setIsPanning] = useState(false);
    const distancePanned = useRef(0);

    const handleMouseDown = (_e: MouseEvent) => {
        setIsPanning(true);
        distancePanned.current = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) 
            return;
        setPan(prevPan => [prevPan[0] + e.movementX, prevPan[1] + e.movementY]);
        distancePanned.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    
    const onNodeClicked = (_e: MouseEvent, str: string) => {
        if (distancePanned.current > 10) 
            return;
        setSt(str);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = (e.currentTarget as Element)!.getBoundingClientRect();
        const scaleFactor = e.ctrlKey ? 0.05 : 0.001;

        let newScale = scale * Math.exp(-e.deltaY * scaleFactor);
        if (newScale < 1)
            newScale = 1;
        else if (newScale > 20)
            newScale = 20;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan[0]) / scale;
        const worldY = (mouseY - pan[1]) / scale;

        const newPanX = mouseX - worldX * newScale;
        const newPanY = mouseY - worldY * newScale;

        setScale(newScale);
        setPan([newPanX, newPanY]);
        requestAnimationFrame(() => setPan([newPanX, newPanY]));
    };

    const svg = useMemo(() => Svg({ onNodeClicked, stations }), []);
    return <main class="mapContainer" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove} onWheel={handleWheel} onMouseLeave={handleMouseUp}>
        <div class="map" children={svg} style={{
            left: `${pan[0]}px`,
            top: `${pan[1]}px`,
            transform: `scale(${scale})`,
            cursor: isPanning ? "grabbing" : "unset",
            maxWidth: "0",
            maxHeight: "0",
        }}/>
    </main>;
}

function Svg({ onNodeClicked, stations }: {
    onNodeClicked: (e: MouseEvent, s: string) => void,
    stations: Stations
}) {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        (async () => {
            const req = await fetch("/map.svg");
            const data = await req.text();
            const parse = new DOMParser().parseFromString(data, "image/svg+xml") as XMLDocument;
            if (parse.firstElementChild instanceof SVGSVGElement) {
                parse.firstElementChild.id = "map";
                return parse.firstElementChild;
            }
            throw new Error("Failed to parse image");
        })().then(svg => {
            if (divRef.current === null)
                throw new Error("null div");

            const layer1 = svg.getElementById("layer1")!;
            for (const child of [...layer1.children]) {
                if (child.id !== "map" && child.id !== "legend") {
                    layer1.removeChild(child);
                }
            }

            for (const [i, _v] of Object.entries(stations.stations)) {
                const el = svg.getElementById(i);
                if (el === null)
                    continue;
                (el as SVGGElement).style.cursor = "pointer";
                el.addEventListener("click", (e) => onNodeClicked(e as MouseEvent, i));

            }
            if (divRef.current.firstElementChild !== null)
                divRef.current.firstElementChild.replaceWith(svg);
            else
                divRef.current!.appendChild(svg);
            
        });
    });

    return <div ref={divRef} />
}
