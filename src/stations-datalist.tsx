import { useContext } from "preact/hooks";
import { StationsDataContext } from "./stations";

export function StationsDatalist({id} : {id: string}) {
    const data = useContext(StationsDataContext);
    return <datalist id={id}>
        {Object.entries(data.stations).map(([k, v]) => <option value={k} label={v.name} />)}
    </datalist>
}