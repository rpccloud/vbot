import React from "react";
import gAppManager from "../AppManager";

export default function Main() {
    return <h2 onClick={() => alert(gAppManager.getRootData().value)}>Main</h2>;
}

