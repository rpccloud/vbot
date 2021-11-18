import React from "react";
import { ThemeContext } from "../context/theme";
import { evalEvent } from "../event/channel";
import { TabBarOnChangeParam, TabRecord } from "./TabBar";

interface TabContainerProps {
    tabBarID: string;
    render: (tabBarID: string, param: TabRecord) => React.ReactNode;
    style?: React.CSSProperties;
}

interface TabContainerState {
    flushCount: number;
}

export class TabContainer extends React.Component<
    TabContainerProps,
    TabContainerState
> {
    static contextType = ThemeContext;

    private tabs: TabRecord[] = [];
    private selectedTab?: TabRecord;

    constructor(props: TabContainerProps) {
        super(props);
        this.state = { flushCount: 0 };
    }

    componentDidMount() {
        evalEvent(this.props.tabBarID, {
            action: "HookChange",
            callback: this.onTabBarChange,
            args: [],
        });
    }

    onTabBarChange = (param: TabBarOnChangeParam) => {
        if (param.selectedTab?.id !== this.selectedTab?.id) {
            const tabs = param.fixedTabs
                .concat(param.floatTabs, param.dynamicTabs)
                .filter((it) => {
                    return it.id !== param.selectedTab?.id;
                });
            if (param.selectedTab) {
                tabs.push(param.selectedTab);
            }

            this.tabs = tabs;
            this.selectedTab = param.selectedTab;
            this.setState((state) => ({
                flushCount: state.flushCount + 1,
            }));
        }
    };

    render() {
        return (
            <div style={{ display: "flex", flex: 1, ...this.props.style }}>
                <div style={{ position: "relative", flex: 1 }}>
                    {this.tabs.map((it) => {
                        const selected = it.id === this.selectedTab?.id;
                        return (
                            <div
                                key={it.id}
                                style={{
                                    display: "flex",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: selected ? 1 : 0,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        position: "static",
                                        flex: 1,
                                    }}
                                >
                                    {this.props.render(this.props.tabBarID, it)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
