import React, { useContext, useState } from "react";
import { Plugin, PluginProps } from "..";

import { FlexBox } from "../../../microui/component/FlexBox";
import { Button, ButtonConfig } from "../../../microui/component/Button";
import { Divider } from "../../../microui/component/Divider";
import { ThemeContext } from "../../../microui/context/theme";

import { AiOutlineLaptop } from "@react-icons/all-files/ai/AiOutlineLaptop";
import { AiOutlineGroup } from "@react-icons/all-files/ai/AiOutlineGroup";
import { IoLogoJavascript } from "@react-icons/all-files/io/IoLogoJavascript";

interface MenuItem {
    key: string;
    icon?: React.ReactNode;
    text?: string;
}

const menuList: MenuItem[] = [
    { key: "server.list", icon: <AiOutlineLaptop />, text: "Servers" },
    { key: "group.list", icon: <AiOutlineGroup />, text: "Groups" },
    { key: "script.list", icon: <IoLogoJavascript />, text: "Scripts" },
];

export const Home = (props: PluginProps) => {
    const theme = useContext(ThemeContext);
    let [selectedKey, setSelectedKey] = useState(menuList[0].key);
    const menuButtonConfig: ButtonConfig = {
        primary: {
            font: theme.default?.outline,
            border: theme.default?.outline,
        },
        hover: {
            font: theme.default?.contrastText,
            border: theme.default?.contrastText,
            background: theme.default?.backgroundLight,
        },
        highlight: {
            border: theme.highlight?.main,
            background: theme.default?.backgroundLight,
        },
        selected: {
            border: theme.hover?.main,
            background: theme.default?.backgroundLight,
        },
        focus: {
            border: theme.highlight?.main,
        },
    };

    let sortedMenuList = menuList.filter((it) => it.key !== selectedKey);
    sortedMenuList.push(...menuList.filter((it) => it.key === selectedKey));
    return (
        <FlexBox
            style={{
                flex: 1,
                flexFlow: "row",
                alignItems: "stretch",
                justifyContent: "start",
            }}
        >
            <FlexBox
                style={{
                    width: 160,
                    flexFlow: "column",
                    overflowY: "auto",
                }}
            >
                {menuList.map((it) => {
                    return (
                        <Button
                            key={it.key}
                            icon={it.icon}
                            text={it.text}
                            ghost={true}
                            border={false}
                            style={{
                                height: 44,
                                minHeight: 44,
                                fontWeight: 900,
                                borderRadius: 0,
                                borderLeftWidth: 3,
                                padding: "0px 10px 0px 10px",
                                justifyContent: "flex-start",
                            }}
                            config={menuButtonConfig}
                            selected={it.key === selectedKey}
                            onClick={() => {
                                setSelectedKey(it.key);
                            }}
                            onEnter={() => {
                                setSelectedKey(it.key);
                            }}
                        />
                    );
                })}
            </FlexBox>
            <Divider type="vertical" space={1} lineWidth={1} />
            <FlexBox style={{ flex: 1 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    {sortedMenuList.map((it) => {
                        return (
                            <div
                                key={it.key}
                                style={{
                                    display: "flex",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: it.key === selectedKey ? 1 : 0,
                                }}
                            >
                                <Plugin
                                    kind={it.key}
                                    tabID={props.tabID}
                                    tabBarID={props.tabBarID}
                                />
                            </div>
                        );
                    })}
                </div>
            </FlexBox>
        </FlexBox>
    );
};
