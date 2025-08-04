import { useContext } from "preact/hooks";
import { eta, StationsDataContext } from "./stations";

export function StationInfo({ selectedStation }: { selectedStation: string }) {
    const data = useContext(StationsDataContext);
    const selected = data.stations[selectedStation];

    return (
        <>
            <h1 class="sidebarTitle">{selected.name}</h1>
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
