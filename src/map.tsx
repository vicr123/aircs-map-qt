import {useEffect, useMemo, useRef, useState} from "preact/hooks";

export function Map({setSt}: { setSt: (s: string) => void }) {
    const [pan, setPan] = useState([0, 0]);
    const [scale, setScale] = useState(5);
    const [isPanning, setIsPanning] = useState(false);

    const onNodeClicked = (_e: MouseEvent, str: string) => {
        console.log(str);
        setSt(str);
    };

    const handleMouseDown = (_e: MouseEvent) => {
        setIsPanning(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) return;
        setPan(prevPan => [prevPan[0] + e.movementX, prevPan[1] + e.movementY]);
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = (e.currentTarget as Element).getBoundingClientRect();
        const scaleFactor = 1.1;

        const newScale = e.deltaY > 0 ? scale / scaleFactor : scale * scaleFactor;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan[0]) / scale;
        const worldY = (mouseY - pan[1]) / scale;

        const newPanX = mouseX - worldX * newScale;
        const newPanY = mouseY - worldY * newScale;

        setScale(newScale);
        setPan([newPanX, newPanY]);
    };

    const svg = useMemo(() => Svg({onNodeClicked}), []);
    return <main class="mapContainer" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                 onMouseMove={handleMouseMove} onWheel={handleWheel}>
        <div class="map" children={svg} style={{
            left: `${pan[0]}px`,
            top: `${pan[1]}px`,
            transform: `scale(${scale})`
        }}/>
    </main>;
}

function Svg({onNodeClicked}: {
    onNodeClicked: (e: MouseEvent, s: string) => void
}) {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        (async () => {
            const req = await fetch("map.svg");
            const data = await req.text();
            const parse = new DOMParser().parseFromString(data, "image/svg+xml") as XMLDocument;
            if (parse.firstElementChild instanceof SVGSVGElement) {
                parse.firstElementChild.id = "map";
                return parse.firstElementChild;
            }
            throw new Error("Failed to parse image");
        })().then(svg => {
            if (divRef.current !== null) {
                for (const i of ["AAR", "ACS"]) {
                    console.log(svg.getElementById(i));
                    (svg.getElementById(i) as SVGGElement).style.cursor = "pointer";
                    svg.getElementById(i)?.addEventListener("click", (e) => onNodeClicked(e as MouseEvent, i));

                }
                if (divRef.current.firstElementChild !== null)
                    divRef.current.firstElementChild.replaceWith(svg);
                else
                    divRef.current!.appendChild(svg);
            }
        });
    });

    return <div ref={divRef}/>
}
