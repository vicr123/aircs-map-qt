import type { ButtonHTMLAttributes } from "preact/compat";
import "./icon-button.css";

export function IconButton({
    src,
    alt,
    class: className,
    ...buttonProps
}: { src: string; alt: string } & ButtonHTMLAttributes) {
    return (
        <button {...buttonProps} class={`iconButton ${className ?? ""}`}>
            <img src={src} alt={alt} />
        </button>
    );
}
