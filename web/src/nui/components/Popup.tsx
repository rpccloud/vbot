import React, { CSSProperties, ReactNode } from "react";
import { makeTransition, Rect } from "..";
import { ActionSonar } from "../utils/action-sonar";
import { ResizeSonar } from "../utils/resize-sonar";
import { Theme, ThemeContext } from "../theme";
import { Config } from "./Config";

interface PopupProps {
    action: Array<"hover" | "click" | "focus">;
    zStep: number;
    renderPopup: (rect: Rect, closePopup: () => void) => ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
}

interface PopupState {
    closing: boolean;
    popup: boolean;
    screenRect?: Rect;
}

export class Popup extends React.Component<PopupProps, PopupState> {
    static contextType = ThemeContext;
    static defaultProps = {
        action: ["click"],
        zStep: 65536,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private focus = false;
    private hover = false;
    private forcePopup = false;
    private popup = false;
    private closing = false;
    private actionSonar?: ActionSonar;
    private resizeSonar?: ResizeSonar;

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            closing: false,
            popup: false,
        };
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

    updatePopup() {
        if (!this.closing) {
            const popup = this.hover || this.focus || this.forcePopup;

            if (this.popup !== popup) {
                this.popup = popup;
                if (popup) {
                    this.resizeSonar?.listenFast();
                } else {
                    this.resizeSonar?.listenSlow();
                }
                this.setState({
                    popup: popup,
                });
            }
        }
    }

    setHover(hover: boolean) {
        this.hover = hover;
        this.updatePopup();
    }

    setFocus(focus: boolean) {
        this.focus = focus;
        this.updatePopup();
    }

    setForcePopup(forcePopup: boolean) {
        this.forcePopup = forcePopup;
        this.updatePopup();
    }

    setClosing(closing: boolean) {
        this.closing = closing;
        this.setState({ closing: closing });
    }

    render() {
        const theme: Theme = this.context;
        const popup = this.state.popup;
        const screenRect = this.state.screenRect || {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const popupZIndex =
            theme.zIndex < 9990000 ? 9990000 : theme.zIndex + this.props.zStep;
        return (
            <div
                ref={this.rootRef}
                style={this.props.style}
                onClick={() => {
                    if (
                        !this.forcePopup &&
                        this.props.action.includes("click")
                    ) {
                        this.setForcePopup(true);
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
                            left:
                                popup && !this.state.closing
                                    ? 0
                                    : screenRect.x + screenRect.width / 2,
                            top:
                                popup && !this.state.closing
                                    ? 0
                                    : screenRect.y + screenRect.height / 2,
                            transform:
                                popup && !this.state.closing
                                    ? `scale(1)`
                                    : `scale(0)`,
                            transformOrigin: "top left",
                            opacity: popup && !this.state.closing ? 1 : 0,
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
                        {popup
                            ? this.props.renderPopup(screenRect, () => {
                                  if (!this.closing) {
                                      this.setClosing(true);
                                      setTimeout(() => {
                                          this.setClosing(false);
                                          this.setForcePopup(false);
                                      }, theme.transition?.durationMS);
                                  }
                              })
                            : null}
                    </div>
                </Config>

                {this.props.children}
            </div>
        );
    }
}
