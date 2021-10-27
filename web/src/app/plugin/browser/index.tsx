import React from "react";

import { TabBar } from "./tab-bar";
import { EventChannel, registerChannel } from "../../../ui/event/event";
import Plugin, { PluginProps } from "..";

interface BrowserState {
    list: Array<PluginProps>;
    focusTabID: number;
}

class Browser extends React.Component<{}, BrowserState> {
    private tabBarRef: any;
    private tabBar: TabBar;
    private channel: EventChannel | null;

    constructor(props: any) {
        super(props);
        this.tabBar = new TabBar(
            (focusTabID: number, list: Array<PluginProps>) => {
                this.setState({
                    list: list,
                    focusTabID: focusTabID,
                });
            }
        );
        this.tabBarRef = React.createRef();
        this.state = {
            list: new Array<PluginProps>(),
            focusTabID: -1,
        };
        this.channel = null;
    }

    componentDidMount() {
        this.channel = registerChannel("vbot-browser");
        this.channel?.listen("AddTab", (param: PluginProps) => {
            this.tabBar.addTab(param, true);
        });
        this.channel?.listen(
            "SetTitle",
            (tabID: number, icon: React.ReactElement, text: string) => {
                this.tabBar.getTabByID(tabID)?.setTitle(icon, text);
            }
        );
        this.tabBarRef.current.appendChild(this.tabBar.getRootElem());
        this.tabBar.addTab({ kind: "home" }, true);
    }

    componentWillUnmount() {
        this.tabBar.destroy();
        this.channel?.close();
        this.channel = null;
    }

    render() {
        return (
            <div style={{ display: "flex", flex: "1 0 0", flexFlow: "column" }}>
                <div ref={this.tabBarRef} />
                {this.state.list.map((it) => {
                    return (
                        <div
                            key={it.tabID}
                            style={{
                                flex:
                                    it.tabID === this.state.focusTabID
                                        ? "1 0 0"
                                        : "0 0 0",
                                overflow: "auto",
                                display: "flex",
                            }}
                        >
                            <Plugin
                                kind={it.kind}
                                param={it.param}
                                tabID={it.tabID}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Browser;
