import { render } from "preact";
import { App } from "./app.tsx";
import "./index.css";
import { fetchStationsData } from "./stations.ts";

const data = await fetchStationsData();
render(<App stationsData={data} />, document.getElementById("app")!);
