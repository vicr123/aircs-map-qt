import "./app.css"
import {Map} from "./map.tsx";

export function App() {
    return (
        <div class="container">
            <div class="topBar">
                <button>Directions</button>
                <input></input>
                <img class="logo" src="/src/assets/aircslogo.svg" alt="AirCS Logo"/>
            </div>
            <Map/>
        </div>
    );
}
