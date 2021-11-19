import React, { useContext, useState } from "react";
import { FlexBox } from "../microui/component/FlexBox";
import { Page } from "../microui/component/Page";
import { TabBar, TabBarConfig } from "../microui/component/TabBar";
import { Plugin } from "./plugin";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { ComponentColor, makeTransition } from "../microui/util";
import { TabContainer } from "../microui/component/TabContainer";
import { ExtraColor } from "./AppManager";

export const Main = () => {
    const theme = useContext(ThemeContext);
    const [tabBarID, setTabBarID] = useState("");
    const tabBarConfig: TabBarConfig = {
        fixedTabs: {
            primary: { background: ExtraColor.tabFixedBG },
            hover: { background: ExtraColor.tabFixedBG },
            selected: { background: ExtraColor.tabFixedBG },
        },
        floatTabs: {
            primary: { background: ExtraColor.tabFloatBG },
            hover: { background: ExtraColor.tabFloatBG },
            selected: { background: ExtraColor.tabFloatBG },
        },
        dynamicTabs: {
            primary: { background: ExtraColor.tabDynamicBG },
            hover: { background: ExtraColor.tabDynamicBG },
            selected: { background: ExtraColor.tabDynamicBG },
        },
    };
    return (
        <Page>
            <FlexBox
                animated={true}
                style={{
                    flex: 1,
                    flexFlow: "column",
                }}
            >
                <Divider space={18} />
                <TabBar
                    size="medium"
                    onInit={(id) => {
                        setTabBarID(id);
                    }}
                    config={tabBarConfig}
                    height={38}
                    style={{
                        marginLeft: 0,
                        marginRight: 0,
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
                <Divider space={1} lineWidth={1} />
                {tabBarID ? (
                    <TabContainer
                        tabBarID={tabBarID}
                        style={{ background: ExtraColor.appDarkBG }}
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
                <Divider space={1} lineWidth={1} />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
