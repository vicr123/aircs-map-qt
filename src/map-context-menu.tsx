import { ContextMenuWithData, MenuItem } from "preact-context-menu";
import "./map-context-menu.css";
import { useContext } from "preact/hooks";
import { StationsDataContext } from "./stations.ts";
export function MapContextMenu({
    id,
    onFromHere,
    onToHere,
}: {
    id: string;
    onFromHere: (st: string) => void;
    onToHere: (st: string) => void;
}) {
    const mapData = useContext(StationsDataContext);
    return (
        <ContextMenuWithData id={id}>
            {(data: string) => (
                <div class="contextMenu">
                    <p>{mapData.stations[data].name}</p>
                    <MenuItem>
                        <a onClick={() => onFromHere(data)}>
                            Directions from here
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a onClick={() => onToHere(data)}>Directions to here</a>
                    </MenuItem>
                </div>
            )}
        </ContextMenuWithData>
    );
}
