import React, { ReactNode } from "react";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    HtmlChecker,
    ITheme,
    makeTransition,
    Point,
    range,
    Theme,
    ThemeCache,
    ThemeContext,
} from "..";
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
            border: "transparent",
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
    left: number;
    width: number;
    minLeft: number;
    maxRight: number;
}

interface TabState {
    bgHover: boolean;
    contentHover: boolean;
    focus: boolean;
    left?: number;
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

    private contentRef = React.createRef<HTMLDivElement>();
    private bgRef = React.createRef<SVGPathElement>();
    private mouseDownPt?: Point;
    private movingBeforeLeft?: number;

    private bgChecker = new HtmlChecker(this.bgRef);
    private contentChecker = new HtmlChecker(this.contentRef);

    constructor(props: TabProps) {
        super(props);

        this.state = {
            bgHover: false,
            contentHover: false,
            focus: false,
        };
    }

    isMoving(): boolean {
        return this.movingBeforeLeft !== undefined;
    }

    componentWillUnmount() {
        this.bgChecker.depose();
        this.contentChecker.depose();
    }

    onPointerDown = (e: React.PointerEvent) => {
        this.mouseDownPt = { x: e.clientX, y: e.clientY };
        (e.target as any).setPointerCapture(e.pointerId);
    };

    onPointerUp = (e: React.PointerEvent) => {
        this.mouseDownPt = undefined;
        this.movingBeforeLeft = undefined;
        this.setState({ left: undefined });
        (e.target as any).releasePointerCapture(e.pointerId);
    };

    onPointerMove = (e: React.PointerEvent) => {
        if (!this.isMoving() && this.mouseDownPt) {
            this.movingBeforeLeft =
                Math.abs(e.clientX - this.mouseDownPt.x) > 8
                    ? this.props.left
                    : undefined;
        }

        if (this.isMoving() && this.mouseDownPt) {
            this.setState({
                left: range(
                    this.movingBeforeLeft! + e.clientX - this.mouseDownPt.x,
                    this.props.minLeft,
                    this.props.maxRight - this.props.width
                ),
            });
        }
    };

    render() {
        let config: TabConfig = getConfig(
            this.context.extend(this.props.theme)
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        if (this.state.bgHover || this.state.contentHover) {
            color = extendColorSet(config.hover, this.props.config.hover);
        }

        if (this.props.selected) {
            color = extendColorSet(config.selected, this.props.config.selected);
        }

        let fontSize = getFontSize(this.props.size);
        let width = this.props.width;
        let height = fontSize * 2;
        let path = makeTabPath(width, height, height / 5);
        let left =
            this.state.left === undefined ? this.props.left : this.state.left;

        return (
            <div
                style={{
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                    position: "absolute",
                    left: left,
                    width: width,
                    height: height,
                    // overflow: "hidden",
                    bottom: 0,
                }}
            >
                <svg
                    height={height}
                    width={width}
                    style={{ position: "absolute" }}
                >
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
                        onMouseMove={() => {
                            if (!this.state.bgHover) {
                                this.setState({ bgHover: true });
                                this.bgChecker.onLostHover(() => {
                                    this.setState({ bgHover: false });
                                });
                            }
                        }}
                        onPointerDown={this.onPointerDown}
                        onPointerUp={this.onPointerUp}
                        onPointerMove={this.onPointerMove}
                    />
                </svg>

                <div
                    ref={this.contentRef}
                    onPointerDown={this.onPointerDown}
                    onPointerUp={this.onPointerUp}
                    onPointerMove={this.onPointerMove}
                    onMouseMove={() => {
                        if (!this.state.contentHover) {
                            this.setState({ contentHover: true });
                            this.contentChecker.onLostHover(() => {
                                this.setState({ contentHover: false });
                            });
                        }
                    }}
                    style={{
                        position: "absolute",
                        color: "red",
                        top: 10,
                        width: 16,
                        height: 50,
                    }}
                >
                    {this.props.minLeft}
                </div>
            </div>
        );
    }
}
