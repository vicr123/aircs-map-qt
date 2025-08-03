import "./top-bar.css";
import logo from "./assets/aircslogo.svg";
import { useContext, useRef } from "preact/hooks";
import { StationsDataContext } from "./stations";

export function TopBar({
    onGetDirection,
    onStationSet: setStation,
}: {
    onGetDirection: () => void;
    onStationSet: (s: string) => void;
}) {
    const data = useContext(StationsDataContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const onInputSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (inputRef.current === null)
            return;
        const val = inputRef.current.value;

        if (val in data.stations) {
            setStation(val);
        }
    };

    return (
        <div class="topBar">
            <img className="logo" src={logo} alt="AirCS Logo" />
            <form onSubmit={onInputSubmit}>
            <input type="search" list="stationsDatalist" ref={inputRef} />
            <input type="submit" hidden/>
            </form>
            <button onClick={onGetDirection}>Get Directions</button>
        </div>
    );
}
