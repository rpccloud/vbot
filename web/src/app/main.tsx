import React, { useContext, useState } from "react";
import { FlexBox } from "../microui/component/FlexBox";
import { Page } from "../microui/component/Page";
import {
    TabBar,
    TabBarConfig,
    TabBarOnChangeParam,
} from "../microui/component/TabBar";
import { Plugin } from "./plugin";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";
import { ThemeContext } from "../microui/context/theme";
import { ComponentColor, makeTransition } from "../microui/util";
import { TabContainer } from "../microui/component/TabContainer";
import { ExtraColor } from "./AppManager";
import { TabBarHelper } from "../microui/component/TabBarHelper";

export const Main = () => {
    const theme = useContext(ThemeContext);
    const [tabBarID, setTabBarID] = useState("");
    const tabBarConfig: TabBarConfig = {
        fixedTabs: {
            primary: { background: ExtraColor.appDarkBG },
            hover: { background: ExtraColor.appBG },
            selected: { background: ExtraColor.appBG },
        },
        floatTabs: {
            primary: { background: ExtraColor.appDarkBG },
            hover: { background: ExtraColor.appBG },
            selected: { background: ExtraColor.appBG },
        },
        dynamicTabs: {
            primary: { background: ExtraColor.appDarkBG },
            hover: { background: ExtraColor.appBG },
            selected: { background: ExtraColor.appBG },
        },
    };

    const tabBar = (
        <TabBar
            size="medium"
            onInit={(id) => {
                setTabBarID(id);
            }}
            config={tabBarConfig}
            height={38}
            borderWidth={2}
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
    );

    const tabBarIndicator = tabBarID ? (
        <TabBarHelper
            tabBarID={tabBarID}
            render={(o: TabBarOnChangeParam) => {
                const selectedID = o.selectedTab?.id;
                return (
                    <div
                        style={{
                            position: "relative",
                            height: 0,
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                height: 2,
                                top: -2,
                                background: theme.primary?.main,
                            }}
                        >
                            {[
                                ...o.fixedTabs,
                                ...o.floatTabs,
                                ...o.dynamicTabs,
                            ].map((it) => {
                                return (
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: it.width,
                                            left: it.left,
                                            height: 2,
                                            background:
                                                it.id !== selectedID
                                                    ? "transparent"
                                                    : theme.default?.divider,
                                            transition: makeTransition(
                                                ["background"],
                                                theme.transition?.duration,
                                                theme.transition?.easing
                                            ),
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                );
            }}
        />
    ) : null;

    const tabBarContainer = tabBarID ? (
        <TabContainer
            tabBarID={tabBarID}
            style={{
                background: `radial-gradient(circle farthest-side, ${ExtraColor.appBG}, ${ExtraColor.appDarkBG})`,
            }}
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
    ) : null;

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
                {tabBar}
                {tabBarIndicator}
                {tabBarContainer}
                <Divider space={2} lineWidth={2} color={theme.primary?.main} />
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
};
