import React, { CSSProperties } from "react";
import {
    ComponentColor,
    extendConfig,
    getFontSize,
    range,
    SeedManager,
    Size,
    TimerManager,
} from "../util";
import { getSeed } from "../../app/plugin/browser/utils";
import { extendTheme, Theme, ThemeCache, ThemeContext } from "../context/theme";
import { ActionSonar } from "../sonar/action";
import { ResizeSonar } from "../sonar/resize";
import { Tab, TabConfig } from "./Tab";
import { EventListener, HandlerParam } from "../event/channel";

let themeCache = new ThemeCache((theme) => ({
    fixedTabs: {
        primary: {
            font: theme.default?.outline,
            background: "transparent",
            border: theme.default?.outline,
            shadow: "transparent",
        },
        hover: {
            font: theme.hover?.contrastText,
            background: "transparent",
            border: theme.hover?.contrastText,
            shadow: "transparent",
        },
        selected: {
            font: theme.highlight?.main,
            background: "transparent",
            border: theme.highlight?.main,
            shadow: "transparent",
        },
        transition: theme.transition,
    },
    floatTabs: {
        primary: {
            font: theme.default?.outline,
            background: "transparent",
            border: theme.default?.outline,
            shadow: "transparent",
        },
        hover: {
            font: theme.hover?.contrastText,
            background: "transparent",
            border: theme.hover?.contrastText,
            shadow: "transparent",
        },
        selected: {
            font: theme.highlight?.main,
            background: "transparent",
            border: theme.highlight?.main,
            shadow: "transparent",
        },
        transition: theme.transition,
    },
    dynamicTabs: {
        primary: {
            font: theme.default?.outline,
            background: "transparent",
            border: theme.default?.outline,
            shadow: "transparent",
        },
        hover: {
            font: theme.hover?.contrastText,
            background: "transparent",
            border: theme.hover?.contrastText,
            shadow: "transparent",
        },
        selected: {
            font: theme.highlight?.main,
            background: "transparent",
            border: theme.highlight?.main,
            shadow: "transparent",
        },
        transition: theme.transition,
    },
}));

export interface TabBarOnChangeParam {
    fixedTabs: TabRecord[];
    floatTabs: TabRecord[];
    dynamicTabs: TabRecord[];
    selectedTab?: TabRecord;
    tabWidth: number;
}

interface FixedTabItem {
    width: number;
    title?: string;
    icon?: React.ReactNode;
    param?: any;
    default?: boolean;
    readonly renderTab?: (
        icon?: React.ReactNode,
        title?: string,
        closable?: boolean,
        color?: ComponentColor
    ) => React.ReactNode;
}

interface FloatTabItem {
    title?: string;
    icon?: React.ReactNode;
    param?: any;
    default?: boolean;
    readonly renderTab?: (
        icon?: React.ReactNode,
        title?: string,
        closable?: boolean,
        color?: ComponentColor
    ) => React.ReactNode;
}

export interface TabBarConfig {
    fixedTabs: TabConfig;
    floatTabs: TabConfig;
    dynamicTabs: TabConfig;
}

interface TabBarProps {
    readonly size: Size;
    readonly theme?: Theme;
    readonly height?: number;
    readonly config: TabBarConfig;
    readonly minTabWidth: number;
    readonly maxTabWidth: number;
    readonly initialFixedTabs?: FixedTabItem[];
    readonly initialFloatTabs?: FloatTabItem[];
    readonly initialDynamicTabs?: FloatTabItem[];
    readonly style?: CSSProperties;
    readonly onInit: (id: string) => void;
}

enum TabKind {
    Fixed,
    Float,
    Dynamic,
}

export interface TabRecord {
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
    selectedTime: number;
    readonly renderTab?: (
        icon?: React.ReactNode,
        title?: string,
        closable?: boolean,
        color?: ComponentColor
    ) => React.ReactNode;
}

interface TabBarState {
    flushCount: number;
}

export class TabBar extends React.Component<TabBarProps, TabBarState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        config: {},
        minTabWidth: 58,
        maxTabWidth: 240,
        onInit: () => {},
    };

    private readonly id: string;
    private eventListener: EventListener;
    private rootRef = React.createRef<HTMLDivElement>();
    private changeCallbacks: ((v: any) => void)[] = [];
    private actionSonar = new ActionSonar([this.rootRef]);
    private resizeSonar = new ResizeSonar(this.rootRef, (rect) => {
        if (rect) {
            this.totalWidth = rect.width;
            this.flush(false, false);
        }
    });

    selectedTab?: TabRecord;
    private totalWidth: number = 0;
    private fixedWidth: number = 0;
    private fixedTabs: TabRecord[];
    private floatTabs: TabRecord[];
    private dynamicTabs: TabRecord[];

    constructor(props: TabBarProps) {
        super(props);
        this.id = `micro-ui-tab-bar-${SeedManager.getSeed()}`;
        this.resizeSonar.listenFast();
        this.state = { flushCount: 0 };
        const nowMS = TimerManager.get().getNowMS();
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
                      selectedTime: it.default ? nowMS : 0,
                      renderTab: it.renderTab,
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
                      selectedTime: it.default ? nowMS : 0,
                      renderTab: it.renderTab,
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
                      selectedTime: it.default ? nowMS : 0,
                      renderTab: it.renderTab,
                  };
              })
            : [];
        this.selectedTab = this.findRecordByID(this.findLastSelectedID());

        this.eventListener = new EventListener(this.id, this.onEventListen);
        props.onInit(this.id);
    }

    private onEventListen = (param: HandlerParam) => {
        switch (param.action) {
            case "HookChange":
                if (param.callback) {
                    param.callback(this.getOnChangeParam());
                    this.changeCallbacks.push(param.callback);
                }
                break;
        }
    };

    private flush(render: boolean, animate: boolean) {
        const resizeTabs = this.floatTabs.length + this.dynamicTabs.length;

        const tabWidth = range(
            Math.floor((this.totalWidth - this.fixedWidth) / resizeTabs),
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
            item.tab?.setLeft(x, false, animate);
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
            item.tab?.setLeft(x, false, animate);
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
            item.tab?.setLeft(x, false, animate);
            item.tab?.setWidth(item.width);
            x += item.width;
        }

        if (render) {
            this.setState((state) => ({
                flushCount: state.flushCount + 1,
            }));
        }

        // fire HookChange functions
        if (this.changeCallbacks.length > 0) {
            const param = this.getOnChangeParam();
            for (let i = 0; i < this.changeCallbacks.length; i++) {
                this.changeCallbacks[i](param);
            }
        }
    }

    private getOnChangeParam(): TabBarOnChangeParam {
        return {
            fixedTabs: this.fixedTabs,
            floatTabs: this.floatTabs,
            dynamicTabs: this.dynamicTabs,
            selectedTab: this.selectedTab,
            tabWidth: this.totalWidth,
        };
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
        this.flush(true, false);
    }

    componentWillUnmount() {
        this.actionSonar.close();
        this.resizeSonar.close();
        this.eventListener.close();
    }

    findLastSelectedID(): number {
        let lastTime = 1;
        let ret = 0;

        for (let item of [
            ...this.fixedTabs,
            ...this.floatTabs,
            ...this.dynamicTabs,
        ]) {
            if (item.selectedTime > lastTime) {
                lastTime = item.selectedTime;
                ret = item.id;
            }
        }

        return ret;
    }

    deleteTab(id: number) {
        this.dynamicTabs = this.dynamicTabs.filter((it) => it.id !== id);

        if (id === this.selectedTab?.id) {
            this.selectedTab = this.findRecordByID(this.findLastSelectedID());
        }

        this.flush(true, false);
    }

    onTabAdded(tab: Tab) {
        const item = this.findRecordByID(tab.props.id);
        if (item) {
            item.tab = tab;
        }
    }

    onPointerDown(id: number) {
        const item = this.findRecordByID(id);
        if (item) {
            item.selectedTime = TimerManager.get().getNowMS();
            this.selectedTab = item;
            this.flush(true, false);
        }
    }

    onPointerUp(id: number) {
        const item = this.findRecordByID(id);
        item?.tab?.setLeft(item.left, false, true);
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
                    this.flush(false, true);
                } else if (item.kind === TabKind.Dynamic) {
                    this.dynamicTabs.splice(item.index, 1);
                    this.dynamicTabs.splice(idx, 0, item);
                    this.flush(false, true);
                } else {
                    // do nothing
                }
            }
        }
    }

    render() {
        let fontSize = getFontSize(this.props.size);
        let height =
            this.props.height !== undefined
                ? this.props.height
                : Math.round(fontSize * 2.3);
        let config: TabBarConfig = extendConfig(
            themeCache.getConfig(extendTheme(this.context, this.props.theme)),
            this.props.config
        );
        return (
            <div
                style={{ fontWeight: 500, ...this.props.style, height: height }}
            >
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
                                height={height}
                                size={this.props.size}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                config={config.fixedTabs}
                                selected={it.id === this.selectedTab?.id}
                                closable={false}
                                renderInner={it.renderTab}
                            ></Tab>
                        );
                    })}

                    {this.floatTabs.map((it) => {
                        return (
                            <Tab
                                key={it.id}
                                id={it.id}
                                tabBar={this}
                                height={height}
                                size={this.props.size}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                config={config.floatTabs}
                                selected={it.id === this.selectedTab?.id}
                                closable={false}
                                renderInner={it.renderTab}
                            ></Tab>
                        );
                    })}

                    {this.dynamicTabs.map((it) => {
                        return (
                            <Tab
                                key={it.id}
                                id={it.id}
                                tabBar={this}
                                height={height}
                                size={this.props.size}
                                icon={it.icon}
                                title={it.title}
                                minLeft={it.minLeft}
                                maxRight={it.maxRight}
                                config={config.dynamicTabs}
                                selected={it.id === this.selectedTab?.id}
                                closable={true}
                                renderInner={it.renderTab}
                            ></Tab>
                        );
                    })}
                </div>
            </div>
        );
    }
}
