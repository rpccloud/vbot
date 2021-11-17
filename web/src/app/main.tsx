import React, { useContext } from "react";
import { FlexBox } from "../microui/component/FlexBox";
import { Page } from "../microui/component/Page";
import { TabBar } from "../microui/component/TabBar";
import { Plugin } from "./plugin";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { AppConfig } from "./AppManager";

// export const Main = () => (
//     <div
//         className="vbot-fill-viewport"
//         style={{ display: "flex", flexFlow: "column" }}
//     >
//         <Plugin kind="browser" />
//         <div style={{ height: 1, background: "var(--Vbot-BorderColor)" }}></div>
//         <Plugin kind="footer" />
//     </div>
// );

export const Main = () => {
    const theme = useContext(ThemeContext);
    const margin = AppConfig.get().margin;
    return (
        <Page>
            <FlexBox
                animated={true}
                style={{
                    flex: "1",
                }}
                justifyContent="flex-start"
                alignItems="stretch"
            >
                <Divider space={10} />
                <TabBar
                    size="large"
                    style={{
                        fontWeight: 500,
                        marginLeft: margin,
                        marginRight: margin,
                    }}
                    initialFixedTabs={[
                        {
                            width: 180,
                            title: "Vbot",
                            default: true,
                        },
                    ]}
                    initialFloatTabs={[
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                    initialDynamicTabs={[
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                ></TabBar>
                <Divider
                    space={1}
                    lineWidth={1}
                    color={theme.default?.outline}
                />
                <FlexBox style={{ flex: 1 }} />
                <Divider
                    space={1}
                    lineWidth={1}
                    color={theme.default?.outline}
                />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
