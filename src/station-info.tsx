import "./station-info.css";
import type { StationsData } from "./stations";

function formatNumber(n: number) {
    return n < 10 ? "0" + n.toString() : n.toString();
}

function eta(blocks: number) {
    const totalSeconds = Math.round(blocks / 8);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

export function StationInfo({
    data,
    selectedStation,
}: {
    data: StationsData;
    selectedStation: string;
}) {
    const selected = data.stations[selectedStation];

    return (
        <>
            <div class="sidebarTitle">{selected.name}</div>
            <table class="sidebarTable">
                <thead>
                    <tr>
                        <th scope="col">Platform</th>
                        <th scope="col" style={{ width: "100%" }}>
                            Destination
                        </th>
                        <th scope="col">ETA</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(selected.platforms).map(
                        ([name, platform]) => (
                            <tr>
                                <th scope="row">{name}</th>
                                <td>{data.stations[platform.station].name}</td>
                                <td>{eta(platform.blocks)}</td>
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </>
    );
}
