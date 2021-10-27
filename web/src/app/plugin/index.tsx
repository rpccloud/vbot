import React from "react";
import Browser from "./browser";
import Footer from "./footer";
import Header from "./header";
import Home from "./home/home";
import ServerCreate from "./server/create";
import ServerDelete from "./server/delete";
import ServerList from "./server/list";
import ServerShow from "./server/show";

export interface PluginProps {
    kind: string;
    param?: any;
    tabID?: number;
}

const Plugin = (props: PluginProps) => {
    switch (props.kind) {
        case "header":
            return <Header />;
        case "footer":
            return <Footer />;
        case "browser":
            return <Browser />;
        case "home":
            return (
                <Home
                    kind={props.kind}
                    param={props.param}
                    tabID={props.tabID}
                />
            );
        case "server.create":
            return (
                <ServerCreate
                    kind={props.kind}
                    param={props.param}
                    tabID={props.tabID}
                />
            );
        case "server.show":
            return (
                <ServerShow
                    kind={props.kind}
                    param={props.param}
                    tabID={props.tabID}
                />
            );
        case "server.delete":
            return (
                <ServerDelete
                    kind={props.kind}
                    param={props.param}
                    tabID={props.tabID}
                />
            );
        case "server.list":
            return (
                <ServerList
                    kind={props.kind}
                    param={props.param}
                    tabID={props.tabID}
                />
            );
        default:
            return (
                <div className="vbot-container-center ">
                    <div
                        style={{
                            color: "var(--Vbot-ErrorColor)",
                            fontSize: "var(--Vbot-FontSizeLarge)",
                        }}
                    >
                        Unknown plugin kind "{props.kind}"
                    </div>
                </div>
            );
    }
};

export default Plugin;
