import React, { CSSProperties, ReactNode } from "react";
import { makeTransition, Rect } from "../";
import { ActionSensor } from "../sensor/action";
import { ResizeSensor } from "../sensor/resize";

interface ZIndex {
    zIndex: number;
}

const ZIndexContext = React.createContext<ZIndex>({
    zIndex: 0,
});

interface PopupProps {
    action: Array<"hover" | "click" | "focus">;
    renderPopup: (rect: Rect, closePopup: () => void) => ReactNode;
    children?: ReactNode;
    zIndex?: number;
    zStep: number;
    style?: CSSProperties;
}

interface PopupState {
    popup: boolean;
    screenRect?: Rect;
}

export class Popup extends React.Component<PopupProps, PopupState> {
    static contextType = ZIndexContext;
    static defaultProps = {
        action: ["click"],
        zStep: 1024,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private actionSensor = new ActionSensor([this.rootRef]);

    private focus = false;
    private hover = false;
    private forcePopup = false;
    private resizeSensor = new ResizeSensor(this.rootRef, (rect) => {
        this.setState({ screenRect: rect });
    });

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            popup: false,
        };
    }

    componentWillUnmount() {
        this.actionSensor.close();
        this.resizeSensor.close();
    }

    updatePopup() {
        const popup = this.hover || this.focus || this.forcePopup;

        if (this.state.popup !== popup) {
            if (popup) {
                this.resizeSensor.listenFast();
            } else {
                this.resizeSensor.listenSlow();
            }

            this.setState({
                popup: popup,
            });
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

    render() {
        const popup = this.state.popup;
        const screenRect = this.state.screenRect || {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const popupZIndex =
            this.context.zIndex < 99999999
                ? 99999999
                : this.context.zIndex + this.props.zStep;
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
                        this.actionSensor.checkHover(
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
                        this.actionSensor.checkFocus(
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
                <ZIndexContext.Provider value={{ zIndex: popupZIndex }}>
                    <div
                        style={{
                            position: "fixed",
                            top: popup
                                ? 0
                                : screenRect.y + screenRect.height / 2,
                            left: popup
                                ? 0
                                : screenRect.x + screenRect.width / 2,
                            opacity: popup ? 1 : 0,
                            zIndex: popupZIndex,
                            transition: makeTransition(
                                ["opacity", "width", "height", "top", "left"],
                                250,
                                "ease-in"
                            ),
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {popup
                            ? this.props.renderPopup(screenRect, () => {
                                  this.setForcePopup(false);
                              })
                            : null}
                    </div>
                </ZIndexContext.Provider>

                {this.props.children}
            </div>
        );
    }
}
