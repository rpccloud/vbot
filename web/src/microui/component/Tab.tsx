import React, { ReactNode } from "react";
import { getFontSize, sizeKind } from "../config";
import { ActionSonar } from "../sonar/action";
import { PointerManager } from "../sonar/pointer";
import { Button } from "./Button";
import { TabBar } from "./TabBar";
import { AiOutlineCloseCircle } from "@react-icons/all-files/ai/AiOutlineCloseCircle";
import { ZIndexContext } from "../context/zIndex";
import { TabConfig } from "../config";
import { makeTransition, range } from "../util";

interface TabProps {
    readonly id: number;
    readonly tabBar: TabBar;
    size: sizeKind;
    config: TabConfig;
    icon?: ReactNode;
    title?: string;
    highlight: boolean;
    minLeft: number;
    maxRight: number;
    closable: boolean;
}

interface TabState {
    width: number;
    hover: boolean;
    focus: boolean;
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
            focus: false,
        };

        this.props.tabBar.onTabAdded(this);
    }

    componentWillUnmount() {
        this.actionSonar.close();
    }

    setLeft(left: number, force: boolean, animate: boolean) {
        if (force || this.beforeMovingLeft === undefined) {
            if (left !== this.currentLeft) {
                this.currentLeft = left;

                if (this.rootRef.current) {
                    if (animate) {
                        this.rootRef.current.style.transition = makeTransition(
                            ["left"],
                            250,
                            "ease-in"
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

        if (this.props.highlight) {
            color = config.highlight;
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
                    color: color?.font,
                    zIndex: this.props.highlight
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
                                250,
                                "ease-in"
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
                        alignItems: "center",
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
                        <>
                            {this.props.icon}
                            <div
                                style={{
                                    width:
                                        this.props.title || this.props.closable
                                            ? inMargin
                                            : 0,
                                }}
                            />
                        </>
                    ) : null}

                    {this.props.title ? (
                        <div
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    WebkitBackgroundClip: "text",
                                    whiteSpace: "nowrap",
                                    color: "transparent",
                                    userSelect: "none",
                                    backgroundImage: `linear-gradient(to right, ${color?.font} 0%, ${color?.font} ${fontDisappearFactor}%, rgba(0, 0, 0, 0)  100%)`,
                                }}
                            >
                                <span>{this.props.title}</span>
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
