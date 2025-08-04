import "./top-bar.css";
import logo from "./assets/aircslogo.svg";
import { StationsInput } from "./stations-input";

export function TopBar({
    onGetDirection,
    onStationSet: setStation,
}: {
    onGetDirection: () => void;
    onStationSet: (s: string) => void;
}) {
    return (
        <div class="topBar">
            <img className="logo" src={logo} alt="AirCS Logo" />
            <StationsInput onSubmit={setStation} />
            <button onClick={onGetDirection}>Get Directions</button>
        </div>
    );
}
