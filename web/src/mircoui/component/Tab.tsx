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
    minLeft: number;
    maxRight: number;
}

interface TabState {
    hover: boolean;
    focus: boolean;
    width: number;
    left: number;
    movingLeft?: number;
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
    private dragInfo?: { x: number; y: number; left: number };
    private actionSonar = new ActionSonar([this.bgRef, this.contentRef]);

    constructor(props: TabProps) {
        super(props);

        this.state = {
            hover: false,
            focus: false,
            width: 0,
            left: 0,
        };

        this.props.tabBar.onTabAdd(this);
    }

    componentWillUnmount() {
        this.actionSonar.close();
    }

    onDragStart = (e: React.DragEvent) => {
        var elem = document.createElement("div");
        elem.id = "drag-ghost";
        elem.style.position = "absolute";
        elem.style.top = "-1000px";
        document.body.appendChild(elem);
        e.dataTransfer.setDragImage(elem, 0, 0);

        e.dataTransfer.dropEffect = "none";
        e.dataTransfer.effectAllowed = "none";

        this.dragInfo = { x: e.clientX, y: e.clientY, left: this.state.left };
        this.props.tabBar.onTabSelect(this.props.id);
    };

    onDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.dragInfo) {
            const movingLeft = range(
                this.dragInfo.left + e.clientX - this.dragInfo.x,
                this.props.minLeft,
                this.props.maxRight - this.state.width
            );

            this.props.tabBar.onTabMove(this.props.id, movingLeft);

            this.setState({
                movingLeft: movingLeft,
            });
        }
    };

    onDrayEnd = (e: React.DragEvent) => {
        this.dragInfo = undefined;
        this.setState({ movingLeft: undefined });
    };

    // onPointerDown = (e: React.PointerEvent) => {
    //     if (this.rootRef.current) {
    //         this.rootRef.current.style.zIndex = "1";
    //         if (this.bgRef.current) {
    //             this.bgRef.current.style.transition = makeTransition(
    //                 ["fill", "stroke"],
    //                 250,
    //                 "ease-in"
    //             );
    //         }
    //     }

    //     this.mouseDownPt = { x: e.clientX, y: e.clientY };
    //     this.bgRef.current!.setPointerCapture(e.pointerId);
    // };

    // onPointerUp = (e: React.PointerEvent) => {
    //     this.bgRef.current!.releasePointerCapture(e.pointerId);
    //     if (this.rootRef.current) {
    //         this.rootRef.current.style.zIndex = "0";
    //     }

    //     this.mouseDownPt = undefined;
    //     this.movingBeforeLeft = undefined;
    //     //  this.setState({movingLeft: undefined})

    //     this.setState({ movingLeft: undefined });
    // };

    setLeft(left: number) {
        if (left !== this.state.left) {
            this.setState({ left: left });
        }
    }

    setWidth(width: number) {
        if (width !== this.state.width) {
            this.setState({ width: width });
        }
    }

    // onPointerMove = (e: React.PointerEvent) => {
    //     if (!this.isMoving() && this.mouseDownPt) {
    //         this.movingBeforeLeft =
    //             Math.abs(e.clientX - this.mouseDownPt.x) > 8
    //                 ? this.state.left
    //                 : undefined;
    //     }

    //     if (
    //         this.isMoving() &&
    //         this.mouseDownPt &&
    //         this.movingBeforeLeft !== undefined
    //     ) {
    //         const movingLeft = range(
    //             this.movingBeforeLeft! + e.clientX - this.mouseDownPt.x,
    //             this.props.minLeft,
    //             this.props.maxRight - this.state.width
    //         );

    //         this.props.tabBar.onTabMove(this.props.id, movingLeft);

    //         this.setState({
    //             movingLeft: movingLeft,
    //         });
    //     }
    // };

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
        let left = this.state.movingLeft || this.state.left;
        let inMargin = Math.round(height / 3);
        let top = Math.round(height / 4);
        let bottom = top;

        return (
            <div
                ref={this.rootRef}
                draggable
                style={{
                    position: "absolute",
                    left: left,
                    width: width,
                    height: height,
                    bottom: 0,
                }}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragEnd={this.onDrayEnd}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
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
                            this.actionSonar.checkHover(
                                () => {
                                    this.setState({ hover: true });
                                },
                                () => {
                                    this.setState({ hover: false });
                                }
                            );
                        }}
                        onMouseDown={() => {}}
                    />
                </svg>

                <div
                    ref={this.contentRef}
                    onDragStart={this.onDragStart}
                    onDrag={this.onDrag}
                    onDragEnd={this.onDrayEnd}
                    onMouseMove={() => {
                        this.actionSonar.checkHover(
                            () => {
                                this.setState({ hover: true });
                            },
                            () => {
                                this.setState({ hover: false });
                            }
                        );
                    }}
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
                >
                    {this.props.minLeft}
                </div>
            </div>
        );
    }
}
