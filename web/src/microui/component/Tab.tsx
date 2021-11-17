import React, { ReactNode } from "react";
import { ComponentColor, getFontSize, Size, Transition } from "../util";
import { ActionSonar } from "../sonar/action";
import { PointerManager } from "../sonar/pointer";
import { Button } from "./Button";
import { TabBar } from "./TabBar";
import { AiOutlineCloseCircle } from "@react-icons/all-files/ai/AiOutlineCloseCircle";
import { ZIndexContext } from "../context/zIndex";
import { makeTransition, range } from "../util";

export interface TabConfig {
    primary?: ComponentColor;
    hover?: ComponentColor;
    selected?: ComponentColor;
    transition?: Transition;
}

interface TabProps {
    readonly id: number;
    readonly tabBar: TabBar;
    size: Size;
    config: TabConfig;
    icon?: ReactNode;
    title?: string;
    selected: boolean;
    minLeft: number;
    maxRight: number;
    closable: boolean;
}

interface TabState {
    width: number;
    hover: boolean;
}

function makeTabPath(w: number, h: number, radius: number): string {
    let r = Math.min(w / 2, h / 2, radius);
    return `M0 ${h} L${2 * r} 1 L${w - 2 * r} 1 L${w} ${h}`;
}

export class Tab extends React.Component<TabProps, TabState> {
    static contextType = ZIndexContext;
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
            hover: false,
        };

        this.props.tabBar.onTabAdded(this);
    }

    componentWillUnmount() {
        this.actionSonar.close();
    }

    setLeft(left: number, force: boolean, animate: boolean) {
        if (force || this.beforeMovingLeft === undefined) {
            if (left !== this.currentLeft) {
                const config = this.props.config;
                this.currentLeft = left;

                if (this.rootRef.current) {
                    if (animate) {
                        this.rootRef.current.style.transition = makeTransition(
                            ["left"],
                            config.transition?.duration,
                            config.transition?.easing
                        );
                    } else {
                        this.rootRef.current.style.transition = "";
                    }
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
        this.props.tabBar.onPointerDown(this.props.id);
    };
    onPointerUp = () => {
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
            this.setLeft(movingLeft, true, false);
        }
    };

    render() {
        let config = this.props.config;

        let color = config.primary;

        if (this.state.hover) {
            color = config.hover;
        }

        if (this.props.selected) {
            color = config.selected;
        }

        let fontSize = getFontSize(this.props.size);
        let width = this.state.width;
        let height = fontSize * 2;
        let path = makeTabPath(width, height, height / 6);
        let leftMargin = Math.round(height / 3);
        let rightMargin = Math.round(height / 3);
        let inMargin = height / 20;
        let top = Math.round(height / 4);
        let bottom = top;

        let labelWidth = range(
            width - 2 * fontSize - leftMargin - rightMargin,
            1,
            999999
        );
        let fontDisappearFactor = Math.floor(
            range(1 - (0.6 * fontSize) / labelWidth, 0, 1) * 100
        );

        return (
            <div
                ref={this.rootRef}
                style={{
                    position: "absolute",
                    width: width,
                    height: height,
                    bottom: 0,
                    zIndex: this.props.selected
                        ? this.context.zIndex + 1
                        : this.context.zIndex,
                }}
            >
                <svg height={height} width={width}>
                    <path
                        ref={this.bgRef}
                        d={path}
                        style={{
                            fill: color?.background,
                            stroke: color?.border,
                            transition: makeTransition(
                                ["fill", "stroke"],
                                config.transition?.duration,
                                config.transition?.easing
                            ),
                            cursor: "pointer",
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
                        display: "flex",
                        position: "absolute",
                        overflow: "hidden",
                        cursor: "pointer",
                        top: top,
                        bottom: bottom,
                        left: leftMargin,
                        right: rightMargin,
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
                    {this.props.icon ? (
                        <div
                            style={{
                                display: "flex",
                                color: color?.font,
                                alignItems: "center",
                                transition: makeTransition(
                                    ["color"],
                                    config.transition?.duration,
                                    config.transition?.easing
                                ),
                                marginRight:
                                    this.props.title || this.props.closable
                                        ? inMargin
                                        : 0,
                            }}
                        >
                            {this.props.icon}
                        </div>
                    ) : null}

                    {this.props.title ? (
                        <div
                            style={{
                                flex: 1,
                                minWidth: 0,
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    position: "absolute",
                                    top: 0,
                                    opacity: 1,
                                    width: "100%",
                                    height: "100%",
                                    WebkitBackgroundClip: "text",
                                    whiteSpace: "nowrap",
                                    color: "transparent",
                                    userSelect: "none",
                                    backgroundImage: `linear-gradient(to right, ${config.primary?.font} 0%, ${config.primary?.font} ${fontDisappearFactor}%, rgba(0, 0, 0, 0)  100%)`,
                                }}
                            >
                                {this.props.title}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    position: "absolute",
                                    top: 0,
                                    opacity: this.state.hover ? 1 : 0,
                                    width: "100%",
                                    height: "100%",
                                    WebkitBackgroundClip: "text",
                                    whiteSpace: "nowrap",
                                    color: "transparent",
                                    userSelect: "none",
                                    backgroundImage: `linear-gradient(to right, ${config.hover?.font} 0%, ${config.hover?.font} ${fontDisappearFactor}%, rgba(0, 0, 0, 0)  100%)`,
                                    transition: makeTransition(
                                        ["opacity"],
                                        config.transition?.duration,
                                        config.transition?.easing
                                    ),
                                }}
                            >
                                {this.props.title}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    position: "absolute",
                                    top: 0,
                                    opacity: this.props.selected ? 1 : 0,
                                    width: "100%",
                                    height: "100%",
                                    WebkitBackgroundClip: "text",
                                    whiteSpace: "nowrap",
                                    color: "transparent",
                                    userSelect: "none",
                                    backgroundImage: `linear-gradient(to right, ${config.selected?.font} 0%, ${config.selected?.font} ${fontDisappearFactor}%, rgba(0, 0, 0, 0)  100%)`,
                                    transition: makeTransition(
                                        ["opacity"],
                                        config.transition?.duration,
                                        config.transition?.easing
                                    ),
                                }}
                            >
                                {this.props.title}
                            </div>
                        </div>
                    ) : null}

                    {this.props.closable ? (
                        <div
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div
                                style={{
                                    width:
                                        this.props.icon || this.props.title
                                            ? inMargin
                                            : 0,
                                }}
                            />
                            <Button
                                round={true}
                                ghost={true}
                                border={false}
                                focusable={false}
                                size={this.props.size}
                                icon={<AiOutlineCloseCircle />}
                                config={{
                                    primary: {
                                        font: color?.font,
                                    },
                                }}
                                style={{
                                    width: fontSize,
                                    height: fontSize,
                                }}
                                onClick={() => {
                                    this.props.tabBar.deleteTab(this.props.id);
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
