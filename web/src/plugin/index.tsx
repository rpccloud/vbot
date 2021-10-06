import React from "react";
import ServerCreate from "./server/create";
import ServerList from "./server/list";
import ServerShow from "./server/show";

interface PluginProps {
    kind: string,
    param: string,
}

function getPlugin(props: PluginProps): any {
    switch (props.kind) {
        case "server.create":
            return (<ServerCreate param={props.param} />)
        case "server.show":
            return (<ServerShow param={props.param} />)
        case "server.list":
            return (<ServerList param={props.param} />)
        default:
            return (
                <div className="vbot-fill-auto vbot-container-center ">
                    <div
                        style={{
                            color: "var(--Vbot-ErrorColor)",
                            fontSize: "var(--Vbot-FontSizeLarge)",
                        }}
                    >
                        Unknown plugin kind "{props.kind}"
                    </div>
                </div>
            )
    }
}

const Plugin = (props: PluginProps) => {
    return (
        <div className="vbot-fill-auto">
            {getPlugin(props)}
        </div>
    )
}

export default Plugin
