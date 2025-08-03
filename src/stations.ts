import { useEffect, useState } from "preact/hooks";

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

export function useStationsData() {
    const [data, setData] = useState<StationsData | null>(null);
    useEffect(() => {
        fetch("/stations.json")
            .then((req) => req.json() as Promise<StationsData>)
            .then(setData);
    }, []);
    return data;
}
