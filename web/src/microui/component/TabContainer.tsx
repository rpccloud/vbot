import React from "react";
import { ThemeContext } from "../context/theme";
import { evalEvent } from "../event/channel";
import { TabBarOnChangeParam } from "./TabBar";

interface TabContainerProps {
    tabBarID: string;
    render: (tabBarID: string, tabID: number, param: any) => React.ReactNode;
}

interface TabContainerState {}

export class TabContainer extends React.Component<
    TabContainerProps,
    TabContainerState
> {
    static contextType = ThemeContext;

    constructor(props: TabContainerProps) {
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

    onTabBarChange = (param: TabBarOnChangeParam) => {
        this.setState({ param: param });
    };

    render() {
        return <div></div>;
    }
}
