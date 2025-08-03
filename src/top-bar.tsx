import "./top-bar.css";
import logo from "./assets/aircslogo.svg";

export function TopBar({ onGetDirection }: { onGetDirection: () => void }) {
    return (
        <div class="topBar">
            <img className="logo" src={logo} alt="AirCS Logo" />
            <input list="stationsDatalist" />
            <button onClick={onGetDirection}>Get Directions</button>
        </div>
    );
}
