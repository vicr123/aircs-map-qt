import "./stations-input.css";
import { useContext, useRef } from "preact/hooks";
import { StationsDataContext } from "./stations";

const fuzzyCollator = new Intl.Collator(undefined, {
    sensitivity: "base",
    usage: "search",
});

export function StationsInput({
    onSubmit,
    onFocus,
    value,
    className
}: {
    onSubmit?: (id: string) => void;
    value?: string;
    className?: string;
    onFocus?: (e: FocusEvent) => void;
}) {
    const data = useContext(StationsDataContext);
    const inputRef = useRef<HTMLInputElement>(null);

    const onFormSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (inputRef.current === null) {
            return;
        }
        const val = inputRef.current.value;

        const found = Object.entries(data.stations).find(
            ([_id, station]) => fuzzyCollator.compare(station.name, val) === 0,
        );

        if (found !== undefined && onSubmit !== undefined) {
            onSubmit(found[0]);
        }
    };

    return (
        <form onSubmit={onFormSubmit} class="stationsInputForm">
            <input
                type="search"
                list="stationsDatalist"
                value={value === undefined ? undefined : data.stations[value]?.name}
                ref={inputRef}
                onFocus={onFocus}
                class={className}
            />
            <input type="submit" hidden />
        </form>
    );
}
