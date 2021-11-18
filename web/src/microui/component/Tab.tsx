import React, { ReactNode } from "react";
import { ComponentColor, getFontSize, Size, Transition } from "../util";
import { ActionSonar } from "../sonar/action";
import { PointerManager } from "../sonar/pointer";
import { Button } from "./Button";
import { TabBar } from "./TabBar";
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import { ZIndexContext } from "../context/zIndex";
import { makeTransition, range } from "../util";
import { FadeBox } from "./FadeBox";

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
    height: number;
    config: TabConfig;
    icon?: ReactNode;
    title?: string;
    selected: boolean;
    minLeft: number;
    maxRight: number;
    closable: boolean;
    renderInner?: (
        icon?: ReactNode,
        title?: string,
        closable?: boolean,
        color?: ComponentColor
    ) => React.ReactNode;
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
        let height = this.props.height;
        let path = makeTabPath(width, height, height / 6);
        let leftMargin = Math.round(height / 3);
        let rightMargin = Math.round(height / 3);
        let inMargin = height / 20;

        let labelWidth = range(
            width - 2 * fontSize - leftMargin - rightMargin,
            1,
            999999
        );
        let fontDisappearFactor = range((0.6 * fontSize) / labelWidth, 0, 1);

        const inner = this.props.renderInner ? (
            this.props.renderInner(
                this.props.icon,
                this.props.title,
                this.props.closable,
                color
            )
        ) : (
            <>
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
                    <FadeBox
                        fade={fontDisappearFactor}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            alignItems: "center",
                            whiteSpace: "nowrap",
                            color: color?.font,
                            userSelect: "none",
                            transition: makeTransition(
                                ["color"],
                                config.transition?.duration,
                                config.transition?.easing
                            ),
                        }}
                    >
                        {this.props.title}
                    </FadeBox>
                ) : null}

                {this.props.closable ? (
                    <div
                        style={{ display: "flex", alignItems: "center" }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Button
                            round={true}
                            ghost={true}
                            border={false}
                            focusable={false}
                            size={this.props.size}
                            icon={<IoCloseOutline />}
                            config={{
                                primary: {
                                    font: color?.font,
                                },
                            }}
                            style={{
                                width: fontSize,
                                height: fontSize,
                                marginLeft:
                                    this.props.icon || this.props.title
                                        ? inMargin
                                        : 0,
                            }}
                            onClick={() => {
                                this.props.tabBar.deleteTab(this.props.id);
                            }}
                        />
                    </div>
                ) : null}
            </>
        );
        return (
            <div
                ref={this.rootRef}
                style={{
                    position: "absolute",
                    fontSize: fontSize,
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
                        top: 0,
                        bottom: 0,
                        cursor: "pointer",
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
                    {inner}
                </div>
            </div>
        );
    }
}
