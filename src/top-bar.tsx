import "./top-bar.css";
import logo from "./assets/aircslogo.svg";


export function TopBar() {
    return <div class="topBar">
        <img className="logo" src={logo} alt="AirCS Logo" />
        <input></input>
        <button>Get Directions</button>
    </div>;
} 