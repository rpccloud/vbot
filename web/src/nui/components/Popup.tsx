import React, { CSSProperties, ReactNode } from "react";
import { makeTransition, Rect } from "..";
import { ActionSonar } from "../utils/action-sonar";
import { ResizeSonar } from "../utils/resize-sonar";
import { Theme, ThemeContext } from "../theme";
import { Config } from "./Config";
import { TimerManager } from "../utils/time-manager";

interface PopupProps {
    action: Array<"hover" | "click" | "focus">;
    zStep: number;
    autoClose: boolean;
    openDelay: number;
    minDuration: number;
    closeDelay: number;
    renderPopup: (rect: Rect, closePopup: () => void) => ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
}

interface PopupState {
    flushCount: number;
    screenRect?: Rect;
}

export class Popup extends React.Component<PopupProps, PopupState> {
    static contextType = ThemeContext;
    static defaultProps = {
        action: ["click"],
        zStep: 65536,
        autoClose: true,
        openDelay: 0,
        minDuration: 1000,
        closeDelay: 0,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private focus = false;
    private hover = false;
    private active = false;

    private popOpeningMS: number = 0;
    private popShowMS: number = 0;
    private popCanCloseMS: number = 0;
    private popClosingMS: number = 0;
    private popInvisibleMS: number = 0;

    private popTimer?: number;

    private popup:
        | "loading"
        | "opening"
        | "show"
        | "canClose"
        | "closing"
        | "invisible" = "invisible";

    private actionSonar?: ActionSonar;
    private resizeSonar?: ResizeSonar;

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            flushCount: 0,
        };
    }

    onTimer(nowMS: number) {
        const theme: Theme = this.context;

        switch (this.popup) {
            case "loading":
                if (nowMS > this.popOpeningMS) {
                    this.popup = "opening";
                    this.popShowMS = nowMS + theme.transition.durationMS;
                    this.flush();
                }
                break;
            case "opening":
                if (nowMS > this.popShowMS) {
                    this.popup = "show";
                    this.popCanCloseMS = nowMS + this.props.minDuration;
                    this.flush();
                }
                break;
            case "show":
                const canClose = !this.hover && !this.focus && !this.active;
                if (
                    canClose &&
                    this.props.autoClose &&
                    nowMS > this.popCanCloseMS
                ) {
                    this.popup = "canClose";
                    this.popClosingMS = nowMS + this.props.closeDelay;
                    this.flush();
                }
                break;
            case "canClose":
                if (nowMS > this.popClosingMS) {
                    this.popup = "closing";
                    this.popInvisibleMS = nowMS + theme.transition.durationMS;
                    this.flush();
                }
                break;
            case "closing":
                if (nowMS > this.popInvisibleMS) {
                    this.popup = "invisible";
                    this.flush();
                }
                break;
            case "invisible":
                if (this.popTimer !== undefined) {
                    this.resizeSonar?.listenSlow();
                    TimerManager.detach(this.popTimer);
                    this.popTimer = undefined;
                    this.updatePopup();
                }
                break;
        }
    }

    componentDidMount() {
        if (this.actionSonar === undefined) {
            this.actionSonar = new ActionSonar([this.rootRef]);
        }

        if (this.resizeSonar === undefined) {
            this.resizeSonar = new ResizeSonar(this.rootRef, (rect) => {
                this.setState({ screenRect: rect });
            });
        }
    }

    componentWillUnmount() {
        if (this.actionSonar !== undefined) {
            this.actionSonar.close();
            this.actionSonar = undefined;
        }

        if (this.resizeSonar !== undefined) {
            this.resizeSonar.close();
            this.resizeSonar = undefined;
        }
    }

    setHover(hover: boolean) {
        if (this.hover !== hover) {
            this.hover = hover;
            this.updatePopup();
        }
    }

    setActive(active: boolean) {
        if (this.active !== active) {
            this.active = active;
            this.updatePopup();
        }
    }

    setFocus(focus: boolean) {
        if (this.focus !== focus) {
            this.focus = focus;
            this.updatePopup();
        }
    }

    updatePopup() {
        const needPopup = this.hover || this.focus || this.active;

        if (needPopup && this.popTimer === undefined) {
            this.popTimer = TimerManager.attach(this);
            TimerManager.fast(this.popTimer);
            this.popup = "loading";
            this.popOpeningMS = TimerManager.getNowMS() + this.props.openDelay;
            this.resizeSonar?.listenFast();
        }
    }

    forceClose() {
        this.popup = "canClose";
        this.popClosingMS = TimerManager.getNowMS();
    }

    flush() {
        this.setState((old) => ({
            flushCount: old.flushCount + 1,
            screenRect: old.screenRect,
        }));
    }

    render() {
        const theme: Theme = this.context;
        const screenRect = this.state.screenRect || {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const popupZIndex =
            theme.zIndex < 9990000 ? 9990000 : theme.zIndex + this.props.zStep;

        const useScreenLayout =
            this.popup === "opening" ||
            this.popup === "show" ||
            this.popup === "canClose";
        const showPopup =
            this.popup === "opening" ||
            this.popup === "show" ||
            this.popup === "canClose" ||
            this.popup === "closing";

        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    ...this.props.style,
                }}
                onMouseDown={() => {
                    if (this.props.action.includes("click")) {
                        this.actionSonar?.checkActive(
                            () => {
                                this.setActive(true);
                            },
                            () => {
                                this.setActive(false);
                            }
                        );
                    }
                }}
                onMouseMove={() => {
                    if (this.props.action.includes("hover")) {
                        this.actionSonar?.checkHover(
                            () => {
                                this.setHover(true);
                            },
                            () => {
                                this.setHover(false);
                            }
                        );
                    }
                }}
                onFocus={(e) => {
                    if (this.props.action.includes("focus")) {
                        this.actionSonar?.checkFocus(
                            () => {
                                this.setFocus(true);
                            },
                            () => {
                                this.setFocus(false);
                            }
                        );
                    }
                }}
            >
                <Config value={{ zIndex: popupZIndex }}>
                    <div
                        style={{
                            position: "fixed",
                            left: useScreenLayout
                                ? 0
                                : screenRect.x + screenRect.width / 2,
                            top: useScreenLayout
                                ? 0
                                : screenRect.y + screenRect.height / 2,
                            transform: useScreenLayout
                                ? `scale(1)`
                                : `scale(0)`,
                            transformOrigin: "top left",
                            opacity: useScreenLayout ? 1 : 0,
                            zIndex: popupZIndex,
                            transition: makeTransition(
                                ["opacity", "transform", "left", "top"],
                                theme.transition?.durationMS + "ms",
                                theme.transition?.easing
                            ),
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {showPopup
                            ? this.props.renderPopup(screenRect, () => {
                                  this.forceClose();
                              })
                            : null}
                    </div>
                </Config>

                {this.props.children}
            </div>
        );
    }
}
