import React, { useContext } from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { Span } from "../../microui/component/Span";
import { ThemeContext } from "../../microui/context/theme";
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

export const Plugin = (props: PluginProps) => {
    const theme = useContext(ThemeContext);
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
                <FlexBox>
                    <Span color={theme.failed?.main}>
                        Unknown plugin kind "{props.kind}"
                    </Span>
                </FlexBox>
            );
    }
};
