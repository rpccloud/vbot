import React, { CSSProperties, ReactNode } from "react";
import { HtmlChecker, makeTransition, ResizeSensor, ScreenRect } from "../";

interface ZIndex {
    zIndex: number;
}

const ZIndexContext = React.createContext<ZIndex>({
    zIndex: 0,
});

interface PopupProps {
    action: Array<"hover" | "click" | "focus">;
    renderPopup: (rect: ScreenRect, closePopup: () => void) => ReactNode;
    children?: ReactNode;
    zIndex?: number;
    zStep: number;
    style?: CSSProperties;
}

interface PopupState {
    popup: boolean;
    screenRect?: ScreenRect;
}

export class Popup extends React.Component<PopupProps, PopupState> {
    static contextType = ZIndexContext;
    static defaultProps = {
        action: ["click"],
        zStep: 1024,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private htmlChecker = new HtmlChecker(this.rootRef);

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
        this.htmlChecker.depose();
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
                    if (!this.hover && this.props.action.includes("hover")) {
                        this.setHover(true);
                        this.htmlChecker.onLostHover(() => {
                            this.setHover(false);
                        });
                    }
                }}
                onFocus={(e) => {
                    if (!this.focus && this.props.action.includes("focus")) {
                        this.setFocus(true);
                        this.htmlChecker.onLostFocus(() => {
                            this.setFocus(false);
                        });
                    }
                }}
            >
                <div
                    style={{ width: 0, height: 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
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
                                width: popup ? "100vw" : 10,
                                height: popup ? "100vh" : 10,
                                opacity: popup ? 1 : 0,
                                background: "rgba(255,255,255,0.5)",
                                zIndex: popupZIndex,
                                alignItems: "center",
                                justifyContent: "center",
                                transition: makeTransition(
                                    [
                                        "opacity",
                                        "width",
                                        "height",
                                        "top",
                                        "left",
                                    ],
                                    250,
                                    "ease-in"
                                ),
                            }}
                        >
                            {popup
                                ? this.props.renderPopup(screenRect, () => {
                                      this.setForcePopup(false);
                                  })
                                : null}
                        </div>
                    </ZIndexContext.Provider>
                </div>

                {this.props.children}
            </div>
        );
    }
}
