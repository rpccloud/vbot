import React from "react";
import { AppClient } from "../../AppManager";

export default function Debug() {
    return (
        <div style={{height: 200, width: 200, background: "red"}}
            onClick={async () => {
                try {
                    let v = await AppClient.get().send(1000, "#.user:login", "ts", "pass")
                    alert(v)
                } catch(e) {
                    alert(e)
                }
            }}>
        </div>
    )
}
