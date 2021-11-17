import React, { useContext } from "react";
import { FlexBox } from "../microui/component/FlexBox";
import { Page } from "../microui/component/Page";
import { TabBar } from "../microui/component/TabBar";
import { Plugin } from "./plugin";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { AppConfig } from "./AppManager";
import { ComponentColor, makeTransition } from "../microui/util";

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
                <Divider space={16} />
                <TabBar
                    size="medium"
                    style={{
                        fontWeight: 500,
                        marginLeft: margin,
                        marginRight: margin,
                    }}
                    initialFixedTabs={[
                        {
                            width: 100,
                            default: true,
                            renderTab: (_, __, ___, color?: ComponentColor) => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 16,
                                            fontWeight: 900,
                                            color: color?.font,
                                            transition: makeTransition(
                                                ["color"],
                                                theme.transition?.duration,
                                                theme.transition?.easing
                                            ),
                                        }}
                                    >
                                        Vbot
                                    </div>
                                );
                            },
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
                <Divider space={1} lineWidth={1} color={theme.primary?.main} />
                <FlexBox style={{ flex: 1 }} />
                <Divider space={1} lineWidth={1} color={theme.primary?.main} />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
