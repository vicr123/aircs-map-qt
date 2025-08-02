import "./sidebar.css";
import type { Stations } from "./stations";

export function Sidebar({ open, stations, selectedStation }: { open: boolean, stations: Stations, selectedStation: string | null }) {
    let child = null;
    if (selectedStation !== null && selectedStation in stations.stations) {
        const selected = stations.stations[selectedStation];

        child = <>
            <div class="title">{selected.name}</div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Platform</th>
                        <th scope="col" style={{width: "100%"}}>Destination</th>
                        <th scope="col">Blocks</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(selected.platforms).map(([name, platform]) => 
                        <tr>
                            <th scope="row">{name}</th>
                            <td>{stations.stations[platform.station].name}</td>
                            <td>{platform.blocks}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>;
    }
    return <div class={open ? "sidebar open" : "sidebar closed"}>
        <div class="sidebarContainer">
            {child}
        </div>
    </div>;
}