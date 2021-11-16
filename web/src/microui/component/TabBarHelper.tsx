import React, { useEffect } from "react";
import { ThemeContext } from "../context/theme";
import { evalEvent } from "../event/channel";
import { FlexBox } from "./FlexBox";
import { TabRecord } from "./TabBar";

interface TabBarHelperProps {
    tabBarID: string;
}
interface TabBarHelperState {}

export class TabBarHelper extends React.Component<
    TabBarHelperProps,
    TabBarHelperState
> {
    static contextType = ThemeContext;

    constructor(props: TabBarHelperProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        evalEvent(this.props.tabBarID, {
            action: "HookChange",
            callback: this.onTabBarChange,
            args: [],
        });
    }

    onTabBarChange = (param: {
        fixedTabs: TabRecord[];
        floatTabs: TabRecord[];
        dynamicTabs: TabRecord[];
        selectedTab: TabRecord;
    }) => {
        console.log(param);
    };

    render() {
        return <FlexBox></FlexBox>;
    }
}
