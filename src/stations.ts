import { createContext } from "preact";

export interface StationsData {
    stations: Record<string, Station>;
}

export interface Station {
    name: string;
    cx: number | null;
    cz: number | null;
    platforms: Record<string, Platform>;
}

export interface Platform {
    station: string;
    blocks: number;
}

export async function fetchStationsData() {
    const req = await fetch("/stations.json");
    const data = (await req.json()) as StationsData;
    const toDelete = [];
    for (const [k, v] of Object.entries(data.stations)) {
        if (v.name.trim() === "") {
            toDelete.push(k);
        }
    }
    for (const k of toDelete) {
        delete data.stations[k];
    }
    return data;
}

export const StationsDataContext = createContext<StationsData>({
    stations: {},
});
