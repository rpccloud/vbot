import React from "react";
import gAppManager from "../AppManager";

export default function Register() {
    return <h2 onClick={() => alert(gAppManager.getRootData().value)}>Register</h2>;
}

