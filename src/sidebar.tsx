import "./sidebar.css";

export function Sidebar({open}: {open: boolean}) {
    return <div class={open ? "sidebar open" : "sidebar closed"}>
        Konqi is coming for you.
    </div>;
}