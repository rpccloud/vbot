import React from "react";
import { getFontSize, ITheme, range, ThemeContext } from "..";
import { getSeed } from "../../app/plugin/browser/utils";
import { ActionSensor } from "../sensor/action";
import { ResizeSensor } from "../sensor/resize";
import { Tab } from "./Tab";

interface FixedTabItem {
    width: number;
    title?: string;
    icon?: React.ReactNode;
    param?: any;
}

interface FloatTabItem {
    title?: string;
    icon?: React.ReactNode;
    param?: any;
}

interface TabBarProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: ITheme;
    minTabWidth: number;
    maxTabWidth: number;
    innerLeft: number;
    innerRight: number;
    initialFixedTabs?: FixedTabItem[];
    initialFloatTabs?: FloatTabItem[];
    initialDynamicTabs?: FloatTabItem[];
}

enum TabKind {
    Fixed,
    Float,
    Dynamic,
}

interface TabRecord {
    readonly id: number;
    title?: string;
    icon?: React.ReactNode;
    param: any;
    left: number;
    width: number;
    minLeft: number;
    maxRight: number;
    kind: TabKind;
    index: number;
    tab?: Tab;
}

interface TabBarState {
    flushCount: number;
    selectedTab?: TabRecord;
}

export class TabBar extends React.Component<TabBarProps, TabBarState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        minTabWidth: 50,
        maxTabWidth: 240,
        innerLeft: 0,
        innerRight: 0,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private actionSensor = new ActionSensor([this.rootRef]);
    private resizeSensor = new ResizeSensor(this.rootRef, (rect) => {
        if (rect) {
            this.totalWidth = rect.width;
            this.flush(false);
        }
    });

    private totalWidth: number = 0;
    private fixedWidth: number = 0;
    private fixedTabs: TabRecord[];
    private floatTabs: TabRecord[];
    private dynamicTabs: TabRecord[];

    constructor(props: TabBarProps) {
        super(props);
        this.resizeSensor.listenFast();
        this.state = { flushCount: 0 };
        this.fixedTabs = props.initialFixedTabs
            ? props.initialFixedTabs.map((it) => {
                  this.fixedWidth += it.width;
                  return {
                      id: getSeed(),
                      title: it.title,
                      icon: it.icon,
                      param: it.param,
                      width: it.width,
                      left: 0,
                      minLeft: 0,
                      maxRight: 0,
                      kind: TabKind.Fixed,
                      index: 0,
                  };
              })
            : [];
        this.floatTabs = props.initialFloatTabs
            ? props.initialFloatTabs.map((it) => {
                  return {
                      id: getSeed(),
                      title: it.title,
                      icon: it.icon,
                      param: it.param,
                      width: 0,
                      left: 0,
                      minLeft: 0,
                      maxRight: 0,
                      kind: TabKind.Float,
                      index: 0,
                  };
              })
            : [];
        this.dynamicTabs = props.initialDynamicTabs
            ? props.initialDynamicTabs.map((it) => {
                  return {
                      id: getSeed(),
                      title: it.title,
                      icon: it.icon,
                      param: it.param,
                      width: 0,
                      left: 0,
                      minLeft: 0,
                      maxRight: 0,
                      kind: TabKind.Dynamic,
                      index: 0,
                  };
              })
            : [];
    }

    private flush(render: boolean) {
        const resizeTabs = this.floatTabs.length + this.dynamicTabs.length;

        const tabWidth = range(
            Math.round((this.totalWidth - this.fixedWidth) / resizeTabs),
            this.props.minTabWidth,
            this.props.maxTabWidth
        );

        let x = 0;

        for (let i = 0; i < this.fixedTabs.length; i++) {
            const item = this.fixedTabs[i];
            item.left = x;
            item.minLeft = x;
            item.maxRight = x + item.width;
            item.index = i;
            item.tab?.setLeft(x);
            item.tab?.setWidth(item.width);
            x += item.width;
        }

        let minFloatLeft = x;
        let maxFloatRight = x + this.floatTabs.length * tabWidth;
        for (let i = 0; i < this.floatTabs.length; i++) {
            const item = this.floatTabs[i];
            item.left = x;
            item.width = tabWidth;
            item.minLeft = minFloatLeft;
            item.maxRight = maxFloatRight;
            item.index = i;
            item.tab?.setLeft(x);
            item.tab?.setWidth(item.width);
            x += item.width;
        }

        let minDynamicLeft = x;
        let maxDynamicRight = x + this.dynamicTabs.length * tabWidth;
        for (let i = 0; i < this.dynamicTabs.length; i++) {
            const item = this.dynamicTabs[i];
            item.left = x;
            item.width = tabWidth;
            item.minLeft = minDynamicLeft;
            item.maxRight = maxDynamicRight;
            item.index = i;
            item.tab?.setLeft(x);
            item.tab?.setWidth(item.width);
            x += item.width;
        }

        if (render) {
            this.setState((state) => ({
                flushCount: state.flushCount + 1,
            }));
        }
    }

    private findRecordByID(id: number): TabRecord | undefined {
        let v = this.fixedTabs.find((it) => it.id === id);
        if (v) {
            return v;
        }
        v = this.floatTabs.find((it) => it.id === id);
        if (v) {
            return v;
        }
        return this.dynamicTabs.find((it) => it.id === id);
    }

    componentDidMount() {
        this.flush(true);
    }

    componentWillUnmount() {
        this.actionSensor.close();
        this.resizeSensor.close();
    }

    onTabAdd(tab: Tab) {
        const item = this.findRecordByID(tab.props.id);
        if (item) {
            item.tab = tab;
        }
    }

    onTabSelect(id: number) {
        this.setState({ selectedTab: this.findRecordByID(id) });
    }

    onTabMove(id: number, left: number) {
        const item = this.findRecordByID(id);
        if (item) {
            const idx = Math.floor(
                (left - item.minLeft + item.width / 2) / item.width
            );
            if (idx !== item.index) {
                if (item.kind === TabKind.Float) {
                    this.floatTabs.splice(item.index, 1);
                    this.floatTabs.splice(idx, 0, item);
                    this.flush(false);
                } else if (item.kind === TabKind.Dynamic) {
                    this.dynamicTabs.splice(item.index, 1);
                    this.dynamicTabs.splice(idx, 0, item);
                    this.flush(false);
                } else {
                    // do nothing
                }
            }
        }
    }

    render() {
        let fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);
        let outerPadding = `0px ${this.props.innerRight}px 0px ${this.props.innerLeft}px`;
        return (
            <div style={{ padding: outerPadding }}>
                <div
                    ref={this.rootRef}
                    style={{ height: height, position: "relative" }}
                >
                    {this.fixedTabs.map((it) => {
                        return (
                            <Tab
                                key={it.id}
                                id={it.id}
                                tabBar={this}
                                size={this.props.size}
                                fontWeight={this.props.fontWeight}
                                theme={this.props.theme}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                selected={it.id === this.state.selectedTab?.id}
                            ></Tab>
                        );
                    })}

                    {this.floatTabs.map((it) => {
                        return (
                            <Tab
                                key={it.id}
                                id={it.id}
                                tabBar={this}
                                size={this.props.size}
                                fontWeight={this.props.fontWeight}
                                theme={this.props.theme}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                selected={it.id === this.state.selectedTab?.id}
                            ></Tab>
                        );
                    })}

                    {this.dynamicTabs.map((it) => {
                        return (
                            <Tab
                                key={it.id}
                                id={it.id}
                                tabBar={this}
                                size={this.props.size}
                                fontWeight={this.props.fontWeight}
                                theme={this.props.theme}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                selected={it.id === this.state.selectedTab?.id}
                            ></Tab>
                        );
                    })}
                </div>
            </div>
        );
    }
}
