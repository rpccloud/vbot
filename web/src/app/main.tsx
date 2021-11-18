import React, { useContext, useState } from "react";
import { FlexBox } from "../microui/component/FlexBox";
import { Page } from "../microui/component/Page";
import { TabBar } from "../microui/component/TabBar";
import { Plugin } from "./plugin";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { AppConfig } from "./AppManager";
import { ComponentColor, makeTransition } from "../microui/util";
import { TabContainer } from "../microui/component/TabContainer";

export const Main = () => {
    const theme = useContext(ThemeContext);
    const margin = AppConfig.get().margin;
    const [tabBarID, setTabBarID] = useState("");
    return (
        <Page>
            <FlexBox
                animated={true}
                style={{
                    flex: 1,
                    flexFlow: "column",
                }}
            >
                <Divider space={16} />
                <TabBar
                    size="medium"
                    onInit={(id) => {
                        setTabBarID(id);
                    }}
                    style={{
                        marginLeft: margin,
                        marginRight: margin,
                    }}
                    initialFixedTabs={[
                        {
                            width: 100,
                            default: true,
                            param: {
                                kind: "home",
                                data: "",
                            },
                            renderTab: (_, __, ___, color?: ComponentColor) => {
                                return (
                                    <FlexBox
                                        style={{
                                            flex: 1,
                                            fontSize: 16,
                                            justifyContent: "center",
                                            alignItems: "center",
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
                                    </FlexBox>
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
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                />
                <Divider space={1} lineWidth={1} color={theme.primary?.main} />
                {tabBarID ? (
                    <TabContainer
                        tabBarID={tabBarID}
                        render={(
                            tabBarID: string,
                            tabID: number,
                            kind?: string,
                            data?: any
                        ) => {
                            return (
                                <Plugin
                                    tabBarID={tabBarID}
                                    tabID={tabID}
                                    kind={kind}
                                    data={data}
                                />
                            );
                        }}
                    />
                ) : null}
                <Divider space={1} lineWidth={1} color={theme.primary?.main} />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
