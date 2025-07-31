import {useEffect, useMemo, useRef} from "preact/hooks";
import type {RefObject} from "preact";

function Svg({divRef, onNodeClicked}: {divRef: RefObject<HTMLDivElement>, onNodeClicked: (s: string) => void}) {
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
                    svg.getElementById(i)?.addEventListener("click", () => onNodeClicked(i));

                }
                if (divRef.current.firstElementChild !== null)
                    divRef.current.firstElementChild.replaceWith(svg);
                else
                    divRef.current!.appendChild(svg);
            }
        });
    });

    return <div className="map" style={{transform: "scale(2)"}} ref={divRef}/>
}

export function Map({setSt}: {setSt: (s: string) => void}) {
    const divRef = useRef<HTMLDivElement>(null);

    function onNodeClicked(str: string) {
        console.log(str);
        setSt(str);
    }

    const svg = useMemo(() => Svg({divRef, onNodeClicked}), []);
    return <main class="mapContainer" children={svg} />;
}