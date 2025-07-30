import "./app.css"
import {useEffect, useRef} from "preact/hooks";


export function App() {
    const obj = useRef<HTMLObjectElement>(null);
    useEffect(() => {
        if (obj.current === null)
            return;
        const loadEv = () => {
            if (obj.current === null)
                return;

            const svg = obj.current.contentDocument!;

            svg.getElementById("ACS")?.addEventListener("click", (e) => {console.log(e)});
        };

        obj.current.addEventListener("load", loadEv);

        return () => {
            obj.current?.removeEventListener("load", loadEv);
        }
    })
    return (
        <div class="container">
            <div class="topBar">
                <button>Directions</button>
                <input></input>
                <img class="logo" src="/src/assets/aircslogo.svg" alt="AirCS Logo"/>
            </div>
            <main class="mapContainer">
                <object ref={obj} class="map" data="map.svg" type="image/svg+xml" aria-description="AirCS Map"/>
            </main>
        </div>);
}
