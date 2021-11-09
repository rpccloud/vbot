import React, { ReactNode } from "react";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    HtmlChecker,
    ITheme,
    makeTransition,
    Point,
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
    hover: boolean;
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

    private rootRef = React.createRef<HTMLDivElement>();
    private bgRef = React.createRef<SVGPathElement>();
    private mouseDownPt?: Point;
    private movingBeforeLeft?: number;

    private htmlChecker = new HtmlChecker(this.bgRef);

    constructor(props: TabProps) {
        super(props);

        this.state = {
            hover: false,
            focus: false,
        };
    }

    isMoving(): boolean {
        return this.movingBeforeLeft !== undefined;
    }

    componentWillUnmount() {
        this.htmlChecker.depose();
    }

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
        let width = this.props.width;
        let height = fontSize * 2;
        let path = makeTabPath(width, height, height / 5);
        let left =
            this.state.left === undefined ? this.props.left : this.state.left;

        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                            if (!this.state.hover) {
                                this.setState({ hover: true });
                                this.htmlChecker.onLostHover(() => {
                                    this.setState({ hover: false });
                                });
                            }
                        }}
                        onPointerDown={(
                            e: React.PointerEvent<SVGPathElement>
                        ) => {
                            this.mouseDownPt = { x: e.clientX, y: e.clientY };
                            this.bgRef.current?.setPointerCapture(e.pointerId);
                        }}
                        onPointerUp={(
                            e: React.PointerEvent<SVGPathElement>
                        ) => {
                            this.mouseDownPt = undefined;
                            this.movingBeforeLeft = undefined;
                            this.setState({ left: undefined });
                            this.bgRef.current?.releasePointerCapture(
                                e.pointerId
                            );
                        }}
                        onPointerMove={(
                            e: React.PointerEvent<SVGPathElement>
                        ) => {
                            if (!this.isMoving() && this.mouseDownPt) {
                                this.movingBeforeLeft =
                                    Math.abs(e.clientX - this.mouseDownPt.x) > 8
                                        ? this.props.left
                                        : undefined;
                            }

                            if (this.isMoving() && this.mouseDownPt) {
                                this.setState({
                                    left:
                                        this.movingBeforeLeft! +
                                        e.clientX -
                                        this.mouseDownPt.x,
                                });
                            }
                        }}
                    />
                </svg>

                <div style={{ background: "red" }}></div>
            </div>
        );
    }
}
