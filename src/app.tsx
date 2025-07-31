import "./app.css"
import {Map} from "./map.tsx";
import {useState} from "preact/hooks";

export function App() {
    const [st, setSt] = useState<string>("");
    return (
        <div class="container">
            <div class="topBar">
                <img className="logo" src="/src/assets/aircslogo.svg" alt="AirCS Logo"/>
                <input value={st}></input>
                <button>Get Directions</button>
            </div>
            <div class="mainContainer">
                <Map setSt={setSt}/>
            </div>
        </div>
    );
}
