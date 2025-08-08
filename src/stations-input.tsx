import { useContext } from "preact/hooks";
import { StationsDataContext, type StationsData } from "./stations";
import type { KeyboardEvent, TargetedEvent } from "preact/compat";

const fuzzyCollator = new Intl.Collator(undefined, {
    sensitivity: "base",
    usage: "search",
});

export function StationsInput({
    onChange,
    onSubmit,
    onFocus,
    value,
    class: className,
    placeholder,
}: {
    onChange?: (id: string) => void;
    onSubmit?: (id: string) => void;
    value?: string;
    class?: string;
    onFocus?: (e: FocusEvent) => void;
    placeholder?: string;
}) {
    const data = useContext(StationsDataContext);

    const onInputChange = (e: TargetedEvent<HTMLInputElement>) => {
        const found = findStation(data, e);
        if (found !== undefined && onChange !== undefined) {
            onChange(found[0]);
        }
    };

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const found = findStation(data, e);
            if (found !== undefined && onSubmit !== undefined) {
                onSubmit(found[0]);
            }
        }
    };

    return (
        <input
            onChange={onInputChange}
            onKeyUp={onKeyPress}
            type="search"
            list="stationsDatalist"
            value={
                value === undefined
                    ? undefined
                    : (data.stations[value]?.name ?? "")
            }
            onFocus={onFocus}
            placeholder={placeholder}
            class={className}
        />
    );
}

function findStation(data: StationsData, e: TargetedEvent<HTMLInputElement>) {
    const val = e.currentTarget.value;

    return Object.entries(data.stations).find(
        ([_id, station]) => fuzzyCollator.compare(station.name, val) === 0,
    );
}
