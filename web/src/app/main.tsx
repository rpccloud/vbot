import React from "react";
import Plugin from "./plugin";

const Main = () => (
    <div
        className="vbot-fill-viewport"
        style={{ display: "flex", flexFlow: "column" }}
    >
        <Plugin kind="browser" />
        <div style={{ height: 1, background: "var(--Vbot-BorderColor)" }}></div>
        <Plugin kind="footer" />
    </div>
);

export default Main;
