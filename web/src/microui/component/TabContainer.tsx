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
        this.tabs = [
            ...param.fixedTabs,
            ...param.floatTabs,
            ...param.dynamicTabs,
        ];
        if (param.selectedTab?.id !== this.selectedTab?.id) {
            this.selectedTab = param.selectedTab;
            this.setState((state) => ({
                flushCount: state.flushCount + 1,
            }));
        }
    };

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flex: "1 1 0",
                    ...this.props.style,
                }}
            >
                <div
                    style={{
                        position: "relative",
                        flex: "1 1 0",
                    }}
                >
                    {this.tabs.map((it) => {
                        return it.id === this.selectedTab?.id ? (
                            <div
                                key={it.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0,
                                    overflowY: "auto",
                                }}
                            >
                                {this.props.render(this.props.tabBarID, it)}
                            </div>
                        ) : null;
                    })}

                    {this.selectedTab ? (
                        <div
                            key={this.selectedTab.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                opacity: 1,
                                overflowY: "auto",
                            }}
                        >
                            {this.props.render(
                                this.props.tabBarID,
                                this.selectedTab
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
