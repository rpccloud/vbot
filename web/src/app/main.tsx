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
                    style={{ fontWeight: 500 }}
                    config={{
                        tab: {
                            highlight: {
                                font: theme.primary?.main,
                                background: "transparent",
                            },
                        },
                    }}
                    innerLeft={AppConfig.get().margin}
                    innerRight={AppConfig.get().margin}
                    initialFixedTabs={[
                        {
                            width: 180,
                            title: "Test",
                            default: true,
                        },
                    ]}
                    initialFloatTabs={[
                        {
                            title: "TestTestTestTestTestTestTestTestTestTestTestTest",
                            icon: <AiOutlineLock />,
                        },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                    initialDynamicTabs={[
                        {
                            title: "TestTestTestTestTestTestTest",
                            icon: <AiOutlineLock />,
                        },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                ></TabBar>
                <Divider
                    space={1}
                    lineWidth={1}
                    color={theme.highlight?.main}
                />
                <FlexBox style={{ flex: 1 }} />
                <Divider
                    space={1}
                    lineWidth={1}
                    color={theme.highlight?.main}
                />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
