import "./top-bar.css";
import logo from "./assets/aircslogo.svg";

export function TopBar({ onGetDirection }) {
    return (
        <div class="topBar">
            <img className="logo" src={logo} alt="AirCS Logo" />
            <input></input>
            <button onClick={onGetDirection}>Get Directions</button>
        </div>
    );
}
