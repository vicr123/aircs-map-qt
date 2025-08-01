import "./top-bar.css";
import logo from "./assets/aircslogo.svg";


export function TopBar({ st }: { st: string }) {
    return <div class="topBar">
        <img className="logo" src={logo} alt="AirCS Logo" />
        <input value={st}></input>
        <button>Get Directions</button>
    </div>;
} 