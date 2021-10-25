import React from "react";
import Footer from "./plugin/footer";
import Browser from "./browser";

const Main = () => (
    <div
        className="vbot-fill-viewport"
        style={{ display: "flex", flexFlow: "column" }}
    >
        <Browser />
        <div style={{ height: 1, background: "var(--Vbot-BorderColor)" }}></div>
        <Footer />
    </div>
);

export default Main;
