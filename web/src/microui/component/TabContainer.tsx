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
    private selectedTabID?: number;

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
        if (param.selectedTab?.id !== this.selectedTabID) {
            this.selectedTabID = param.selectedTab?.id;
            this.setState((state) => ({
                flushCount: state.flushCount + 1,
            }));
        }
    };

    render() {
        return (
            <div
                style={{
                    background: "gray",
                    flex: 1,
                    display: "flex",
                    ...this.props.style,
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {this.tabs.map((it) => (
                        <div
                            key={it.id}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                opacity: it.id === this.selectedTabID ? 1 : 0,
                            }}
                        >
                            {this.props.render(this.props.tabBarID, it)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
