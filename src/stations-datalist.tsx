import { useContext } from "preact/hooks";
import { StationsDataContext } from "./stations";

export function StationsDatalist({ id }: { id: string }) {
    const data = useContext(StationsDataContext);
    return (
        <datalist id={id}>
            {Object.values(data.stations).map((v) => (
                <option value={v.name} />
            ))}
        </datalist>
    );
}
