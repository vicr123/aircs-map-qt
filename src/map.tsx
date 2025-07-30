import {useEffect, useMemo, useRef, useState} from "preact/hooks";
import type {RefObject} from "preact";

function Svg({ref: obj}: {ref: RefObject<HTMLObjectElement>}) {
    function loadEv() {
        const svg = obj.current!.contentDocument!;

        console.log(svg.getElementById("ACS"));

        for (const i of ["ACS", "AAR"]) {
            svg.getElementById(i)!.addEventListener("click", (e) => {
                console.log(i);
            });
        }

        svg.addEventListener("click", (e) => {console.log(e)});
    }

    return <object ref={obj} className="map" data="map.svg" type="image/svg+xml" aria-description="AirCS Map"
                   onLoad={loadEv} onClick={() => console.log("a")}/>;
}

export function Map() {
    const obj = useRef<HTMLObjectElement>(null);
    const svg = useMemo(() => Svg({ref: obj}), []);
    const [st, setSt] = useState(2);

    useEffect(() => {
        obj.current!.style.transform = `scale(${st})`;
    }, [st]);

    return <div className="mapContainer" children={svg} onClickCapture={a} />;

    function a() {
        console.log(st);
        return setSt(st + 0.1);
    }
}