import "./top-bar.css";
import logo from "./assets/aircslogo.svg";


export function TopBar({ st, onGetDir }: { st: string, onGetDir: () => void }) {
    return <div class="topBar">
        <img className="logo" src={logo} alt="AirCS Logo" />
        <input value={st}></input>
        <button onClick={onGetDir}>Get Directions</button>
    </div>;
} 