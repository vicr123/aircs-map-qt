import { useEffect, useState } from "preact/hooks";

export interface Stations {
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

export function useStations() {
    const [data, setData] = useState<Stations | null>(null);
    useEffect(() => {
        fetch("/stations.json").then(req => req.json() as Promise<Stations>).then(setData);
    }, []);
    return data;
}