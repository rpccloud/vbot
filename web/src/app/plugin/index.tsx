import React, { useContext } from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { Span } from "../../microui/component/Span";
import { ThemeContext } from "../../microui/context/theme";
import Footer from "./footer";
import Header from "./header";
import { Home } from "./home/home";
import ServerCreate from "./server/create";
import ServerDelete from "./server/delete";
import ServerList from "./server/list";
import ServerShow from "./server/show";

export interface PluginProps {
    kind?: string;
    data?: any;
    tabID?: number;
    tabBarID?: string;
}

export const Plugin = (props: PluginProps) => {
    const theme = useContext(ThemeContext);
    switch (props.kind) {
        case "header":
            return <Header />;
        case "footer":
            return <Footer />;
        case "home":
            return <Home {...props} />;
        case "server.create":
            return <ServerCreate {...props} />;
        case "server.show":
            return <ServerShow {...props} />;
        case "server.delete":
            return <ServerDelete {...props} />;
        case "server.list":
            return <ServerList {...props} />;
        default:
            return (
                <FlexBox style={{ flex: 1 }}>
                    <Span color={theme.failed?.main}>
                        Unknown plugin kind "{props.kind}"
                    </Span>
                </FlexBox>
            );
    }
};
