import "./top-bar.css"

export function TopBar({ st }: { st: string }) {
    return <div class="topBar">
        <img className="logo" src="/src/assets/aircslogo.svg" alt="AirCS Logo" />
        <input value={st}></input>
        <button>Get Directions</button>
    </div>;
} 