import React from "react";
import {
    getFontSize,
    HtmlChecker,
    ITheme,
    range,
    ResizeSensor,
    ThemeContext,
} from "..";
import { getSeed } from "../../app/plugin/browser/utils";
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
    innerLeft?: number;
    innerRight?: number;
    initialFixedTabs?: FixedTabItem[];
    initialFloatTabs?: FloatTabItem[];
}

interface TabRecord {
    readonly id: number;
    width: number;
    title?: string;
    icon?: React.ReactNode;
    param: any;
}

interface TabBarState {
    fixedTabs: TabRecord[];
    floatTabs: TabRecord[];
    dynamicTabs: TabRecord[];
    selectedID?: number;
}

export class TabBar extends React.Component<TabBarProps, TabBarState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        minTabWidth: 50,
        maxTabWidth: 240,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private htmlChecker = new HtmlChecker(this.rootRef);
    private resizeSensor = new ResizeSensor(this.rootRef, (rect) => {
        if (rect) {
            this.totalWidth = rect.width;
        }
    });

    private totalWidth: number = 0;
    private fixedWidth: number = 0;

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            fixedTabs: props.initialFixedTabs
                ? props.initialFixedTabs.map((it) => {
                      this.fixedWidth += it.width;
                      return {
                          id: getSeed(),
                          width: it.width,
                          title: it.title,
                          icon: it.icon,
                          param: it.param,
                      };
                  })
                : [],
            floatTabs: props.initialFloatTabs
                ? props.initialFloatTabs.map((it) => {
                      return {
                          id: getSeed(),
                          width: 0,
                          title: it.title,
                          icon: it.icon,
                          param: it.param,
                      };
                  })
                : [],
            dynamicTabs: [],
        };
    }

    private flush() {
        const left = this.props.innerLeft || 0;
        const right = this.props.innerRight || 0;
        const resizeTabs =
            this.state.floatTabs.length + this.state.dynamicTabs.length;

        const tabWidth = range(
            (this.totalWidth - left - right - this.fixedWidth) / resizeTabs,
            this.props.minTabWidth,
            this.props.maxTabWidth
        );
    }

    componentDidMount() {}

    componentWillUnmount() {
        this.htmlChecker.depose();
        this.resizeSensor.close();
    }

    onLayoutTabResize(id: number, width: number) {}

    render() {
        let fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);
        return (
            <div
                ref={this.rootRef}
                style={{ height: height, position: "relative" }}
            >
                {this.state.fixedTabs.map((it) => {
                    return (
                        <Tab
                            id={it.id}
                            tabBar={this}
                            size={this.props.size}
                            fontWeight={this.props.fontWeight}
                            theme={this.props.theme}
                            icon={it.icon}
                            title={it.title}
                            width={it.width}
                            selected={it.id === this.state.selectedID}
                        ></Tab>
                    );
                })}
            </div>
        );
    }
}
