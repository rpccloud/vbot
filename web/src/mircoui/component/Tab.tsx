import React, { ReactNode } from "react";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    ITheme,
    makeTransition,
    range,
    Theme,
    ThemeCache,
    ThemeContext,
} from "..";
import { ActionSonar } from "../sonar/action";
import { PointerManager } from "../sonar/pointer";
import { TabBar } from "./TabBar";

interface TabConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    selected?: ColorSet;
}

function getConfig(theme: Theme): TabConfig {
    const themeKey = theme.hashKey();
    let record: TabConfig = themeCache.getConfig(themeKey);
    if (record) {
        return record;
    }

    record = {
        normal: {
            font: theme.primary.main.hsla,
            background: "transparent",
            border: theme.primary.main.hsla,
            shadow: "transparent",
            auxiliary: "transparent",
        },
        hover: {
            font: theme.primary.main.hsla,
            background: "transparent",
            border: theme.primary.auxiliary.hsla,
            shadow: "transparent",
            auxiliary: "transparent",
        },
        selected: {
            font: theme.primary.main.lighten(5).hsla,
            background: theme.primary.auxiliary.lighten(5).hsla,
            border: theme.primary.auxiliary.lighten(5).hsla,
            shadow: theme.primary.auxiliary.lighten(5).hsla,
            auxiliary: "transparent",
        },
    };

    themeCache.setConfig(themeKey, record);

    return record;
}

let themeCache = new ThemeCache();

interface TabProps {
    readonly id: number;
    readonly tabBar: TabBar;
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: ITheme;
    config: TabConfig;
    icon?: ReactNode;
    title?: string;
    selected: boolean;
    minLeft: number;
    maxRight: number;
    zIndex: number;
}

interface TabState {
    width: number;
    active: boolean;
    hover: boolean;
    focus: boolean;
}

function makeTabPath(w: number, h: number, radius: number): string {
    let r = Math.min(w / 2, h / 2, radius);
    return `M0 ${h} L${2 * r} 1 L${w - 2 * r} 1 L${w} ${h}`;
}

export class Tab extends React.Component<TabProps, TabState> {
    static contextType = ThemeContext;
    static defaultProps = {
        config: {},
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private contentRef = React.createRef<HTMLDivElement>();
    private bgRef = React.createRef<SVGPathElement>();
    private actionSonar = new ActionSonar([this.bgRef, this.contentRef]);

    private currentLeft: number = 0;

    private currentWidth: number = 0;
    private beforeMovingLeft?: number;

    constructor(props: TabProps) {
        super(props);

        this.state = {
            width: 0,
            active: false,
            hover: false,
            focus: false,
        };

        this.props.tabBar.onTabAdd(this);
    }

    componentWillUnmount() {
        this.actionSonar.close();
    }

    setLeft(left: number, force?: boolean) {
        if (force || this.beforeMovingLeft === undefined) {
            if (left !== this.currentLeft) {
                this.currentLeft = left;
                if (this.rootRef.current) {
                    this.rootRef.current.style.left = `${left}px`;
                }
            }
        }
    }

    setWidth(width: number) {
        if (width !== this.currentWidth) {
            this.currentWidth = width;
            this.setState({ width: width });
        }
    }

    onPointerDown = () => {
        this.setState({ active: true });
        this.props.tabBar.onPointerDown(this.props.id);
    };
    onPointerUp = () => {
        this.setState({ active: false });
        this.beforeMovingLeft = undefined;
        this.props.tabBar.onPointerUp(this.props.id);
    };
    onPointerMove = (deltaX: number) => {
        if (this.beforeMovingLeft === undefined && Math.abs(deltaX) > 8) {
            this.beforeMovingLeft = this.currentLeft;
        }

        if (this.beforeMovingLeft !== undefined) {
            const movingLeft = range(
                this.beforeMovingLeft + deltaX,
                this.props.minLeft,
                this.props.maxRight - this.currentWidth
            );
            this.props.tabBar.onTabMove(this.props.id, movingLeft);
            this.setLeft(movingLeft, true);
        }
    };

    render() {
        let config: TabConfig = getConfig(
            this.context.extend(this.props.theme)
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        if (this.state.hover) {
            color = extendColorSet(config.hover, this.props.config.hover);
        }

        if (this.props.selected) {
            color = extendColorSet(config.selected, this.props.config.selected);
        }

        let fontSize = getFontSize(this.props.size);
        let width = this.state.width;
        let height = fontSize * 2;
        let path = makeTabPath(width, height, height / 6);
        let inMargin = Math.round(height / 3);
        let top = Math.round(height / 4);
        let bottom = top;

        return (
            <div
                ref={this.rootRef}
                style={{
                    position: "absolute",
                    width: width,
                    height: height,
                    bottom: 0,
                    zIndex: this.state.active
                        ? this.props.zIndex + 1
                        : this.props.zIndex,
                    transition: this.state.active
                        ? ""
                        : makeTransition(["left"], 250, "ease-in"),
                }}
            >
                <svg height={height} width={width}>
                    <path
                        ref={this.bgRef}
                        d={path}
                        style={{
                            fill: color.background,
                            stroke: color.border,
                            transition: makeTransition(
                                ["fill", "stroke"],
                                250,
                                "ease-in"
                            ),
                        }}
                        onPointerMove={() => {
                            this.actionSonar.checkHover(
                                () => {
                                    this.setState({ hover: true });
                                },
                                () => {
                                    this.setState({ hover: false });
                                }
                            );
                        }}
                        onPointerDown={() => {
                            PointerManager.get().checkPointerMove(
                                this.onPointerDown,
                                this.onPointerMove,
                                this.onPointerUp
                            );
                        }}
                    />
                </svg>

                <div
                    ref={this.contentRef}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        position: "absolute",
                        background: "red",
                        top: top,
                        bottom: bottom,
                        left: inMargin,
                        right: inMargin,
                    }}
                    onPointerMove={() => {
                        this.actionSonar.checkHover(
                            () => {
                                this.setState({ hover: true });
                            },
                            () => {
                                this.setState({ hover: false });
                            }
                        );
                    }}
                    onPointerDown={() => {
                        PointerManager.get().checkPointerMove(
                            this.onPointerDown,
                            this.onPointerMove,
                            this.onPointerUp
                        );
                    }}
                >
                    {this.props.minLeft}
                </div>
            </div>
        );
    }
}
