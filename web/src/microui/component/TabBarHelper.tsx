import React from "react";
import { ThemeContext } from "../context/theme";
import { evalEvent } from "../event/channel";
import { TabBarOnChangeParam } from "./TabBar";

interface TabBarHelperProps {
    tabBarID: string;
    render: (param: TabBarOnChangeParam) => React.ReactNode;
}
interface TabBarHelperState {
    param?: TabBarOnChangeParam;
}

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

    onTabBarChange = (param: TabBarOnChangeParam) => {
        this.setState({ param: param });
    };

    render() {
        const param = this.state.param;
        return param ? this.props.render(param) : null;
    }
}
