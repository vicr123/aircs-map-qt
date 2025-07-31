import "./app.css"
import {Map} from "./map.tsx";
import {useState} from "preact/hooks";

export function App() {
    const [st, setSt] = useState<string>("");
    return (
        <div class="container">
            <div class="topBar">
                <button>Directions</button>
                <input value={st}></input>
                <img class="logo" src="/src/assets/aircslogo.svg" alt="AirCS Logo"/>
            </div>
            <Map setSt={setSt}/>
        </div>
    );
}
