import React from "react";
import { makeTransition, range, UIState, UIStateConfig } from "..";
import { TimerManager } from "../utils/time-manager";
import { Theme } from "../theme";
import { PointerManager } from "../utils/pointer-manager";

interface FrameProps {
    show: boolean;
    opacityEffect: boolean;
    scaleEffect: boolean;
    inset: number;
    transition: {
        durationMS: number;
        easing: string;
    };
    borderRadius: number;
    borderWidth: number;
    borderStyle: string;
    borderColor?: string;
    backgroundColor?: string;
    backgroundOpacity: number;
    boxShadow?: string;
}

interface FrameState {
    init: boolean;
    show: boolean;
}

class Frame extends React.Component<FrameProps, FrameState> {
    private effectRef = React.createRef<HTMLDivElement>();
    private minScaleTime = 0;
    private startScaleTime = 0;
    private show: boolean;

    constructor(props: FrameProps) {
        super(props);
        this.show = this.props.show;
        this.state = {
            init: !this.props.scaleEffect && !this.props.opacityEffect,
            show: this.props.show,
        };
    }

    componentDidMount() {
        if (!this.state.init) {
            setTimeout(() => {
                this.setState({ init: true });
            }, 30);
        }
    }

    private updateShow() {
        if (this.show !== this.props.show) {
            this.show = this.props.show;
            if (this.show) {
                if (this.props.scaleEffect) {
                    this.startScaleTime = TimerManager.getNowMS();
                    this.minScaleTime = this.props.transition.durationMS;
                }
                setTimeout(() => {
                    this.setState({ show: this.show });
                });
            } else {
                const dur = TimerManager.getNowMS() - this.startScaleTime;
                setTimeout(
                    () => {
                        this.setState({ show: this.show });
                    },
                    dur > this.minScaleTime ? 0 : this.minScaleTime - dur
                );
            }
        }
    }

    private renderWithEffect() {
        this.updateShow();
        let {
            scaleEffect,
            inset,
            borderWidth,
            borderColor,
            borderRadius,
            boxShadow,
            transition,
            borderStyle,
            backgroundColor,
            backgroundOpacity,
        } = this.props;

        const effectElem = this.effectRef.current;
        const effectRect = effectElem
            ? effectElem.getBoundingClientRect()
            : { x: 0, y: 0, width: 0, height: 0 };

        const mousePT = PointerManager.getMouseLocation();
        const pt = { x: mousePT.x - effectRect.x, y: mousePT.y - effectRect.y };
        const rw = effectRect.width;
        const rh = effectRect.height;
        const mouseX = range(pt.x, 0, rw);
        const mouseY = range(pt.y, 0, rw);
        const maxDeltaX = Math.max(mouseX, rw - mouseX);
        const maxDeltaY = Math.max(mouseY, rh - mouseY);
        const radius = Math.ceil(
            Math.sqrt(Math.pow(maxDeltaX, 2) + Math.pow(maxDeltaY, 2))
        );

        const show = this.state.init && this.state.show;

        return (
            <div
                ref={this.effectRef}
                style={{
                    position: "absolute",
                    inset: inset,
                    transition: makeTransition(
                        ["opacity"],
                        transition.durationMS + "ms",
                        transition.easing
                    ),
                    boxSizing: "border-box",
                    opacity: show ? 1 : 0,
                    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius,
                    boxShadow: boxShadow,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        transition: makeTransition(
                            ["transform"],
                            transition.durationMS + "ms",
                            transition.easing
                        ),
                        opacity: backgroundOpacity,
                        transform:
                            show || !scaleEffect ? "scale(1)" : "scale(0)",
                        left: mouseX - radius,
                        top: mouseY - radius,
                        width: 2 * radius,
                        height: 2 * radius,
                        borderRadius: radius,
                        backgroundColor: backgroundColor,
                    }}
                />
            </div>
        );
    }

    private renderWithoutEffect() {
        let {
            inset,
            borderWidth,
            borderColor,
            backgroundColor,
            borderRadius,
            boxShadow,
            borderStyle,
            transition,
        } = this.props;

        const transitionString = makeTransition(
            ["all"],
            transition.durationMS + "ms",
            transition.easing
        );

        return (
            <div
                ref={this.effectRef}
                style={{
                    position: "absolute",
                    inset: inset,
                    boxSizing: "border-box",
                    opacity: this.props.show ? 1 : 0,
                    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius,
                    boxShadow: boxShadow,
                    overflow: "hidden",
                    transition: transitionString,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        transition: transitionString,
                        inset: 0,
                        opacity: this.props.backgroundOpacity,
                        backgroundColor: backgroundColor,
                    }}
                />
            </div>
        );
    }

    render() {
        if (this.props.scaleEffect || this.props.opacityEffect) {
            return this.renderWithEffect();
        } else {
            return this.renderWithoutEffect();
        }
    }
}

interface BackgroundProps {
    theme: Theme;
    isFocus: boolean;
    hoverScaleEffect: boolean;
    activeScaleEffect: boolean;
    focusInset: number;
    borderWidth: number;
    borderRadius: number;
    uiState: UIState;
    uiOpacity: { normal: number; hover: number; active: number };
    uiBorder: UIStateConfig;
    uiBackground: UIStateConfig;
    uiShadow: UIStateConfig;
}

export class Background extends React.Component<BackgroundProps, {}> {
    private hasFrame: boolean = false;

    constructor(props: BackgroundProps) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            theme,
            isFocus,
            focusInset,
            borderWidth,
            borderRadius,
            uiState,
            uiBorder,
            uiBackground,
            uiShadow,
            uiOpacity,
            hoverScaleEffect,
            activeScaleEffect,
        } = this.props;

        if (!this.hasFrame) {
            this.hasFrame =
                uiState.isHover ||
                uiState.isActive ||
                uiState.isSelected ||
                isFocus;
        }

        const isDisabled = uiState.isDisabled;

        return (
            <div
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                <Frame
                    show={true}
                    scaleEffect={false}
                    opacityEffect={false}
                    inset={0}
                    transition={theme.transition}
                    borderRadius={borderRadius}
                    borderStyle="solid"
                    borderWidth={borderWidth}
                    backgroundOpacity={uiOpacity.normal}
                    borderColor={
                        isDisabled ? uiBorder.disabled : uiBorder.normal
                    }
                    backgroundColor={
                        isDisabled ? uiBackground.disabled : uiBackground.normal
                    }
                    boxShadow={isDisabled ? uiShadow.disabled : uiShadow.normal}
                />
                {this.hasFrame && !isDisabled ? (
                    <>
                        <Frame
                            show={uiState.isHover}
                            scaleEffect={hoverScaleEffect}
                            opacityEffect={true}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.hover}
                            backgroundColor={uiBackground.hover}
                            backgroundOpacity={uiOpacity.hover}
                            boxShadow={uiShadow.hover}
                        />
                        <Frame
                            show={uiState.isActive}
                            scaleEffect={activeScaleEffect}
                            opacityEffect={true}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.active}
                            backgroundColor={uiBackground.active}
                            backgroundOpacity={uiOpacity.active}
                            boxShadow={uiShadow.active}
                        />
                        <Frame
                            show={uiState.isSelected}
                            scaleEffect={false}
                            opacityEffect={true}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.selected}
                            backgroundColor={uiBackground.selected}
                            backgroundOpacity={1}
                            boxShadow={uiShadow.selected}
                        />
                        <Frame
                            show={isFocus}
                            scaleEffect={false}
                            opacityEffect={true}
                            inset={focusInset}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            borderStyle={theme.focus.borderStyle}
                            borderWidth={theme.focus.borderWidth}
                            borderColor={theme.focus.borderColor}
                            backgroundColor={"transparent"}
                            backgroundOpacity={1}
                            boxShadow={""}
                        />
                    </>
                ) : null}
            </div>
        );
    }
}
