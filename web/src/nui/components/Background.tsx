import React from "react";
import { makeTransition, range, UIState, UIStateConfig } from "..";
import { TimerManager } from "../../microui/util";
import { Theme } from "../theme";
import { PointerManager } from "../utils/pointer-manager";

interface FrameProps {
    show: boolean;
    scaleEffect: boolean;
    inset: number;
    transition: {
        durationMS: number;
        easing: string;
    };
    borderRadius: number;
    maxOpacity: number;
    borderWidth: number;
    borderStyle: string;
    borderColor?: string;
    backgroundColor?: string;
    boxShadow?: string;
}

interface FrameState {
    show: boolean;
}

class Frame extends React.Component<FrameProps, FrameState> {
    private effectRef = React.createRef<HTMLDivElement>();
    private minEffectTime = 0;
    private effectStartTime = 0;
    private show = false;

    constructor(props: FrameProps) {
        super(props);
        this.state = {
            show: false,
        };
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.setState({ init: true });
    //     });
    // }

    private updateShow() {
        if (this.show !== this.props.show) {
            this.show = this.props.show;
            if (this.show) {
                if (this.props.scaleEffect) {
                    this.effectStartTime = TimerManager.get().getNowMS();
                    this.minEffectTime = this.props.transition.durationMS;
                }

                setTimeout(() => {
                    this.flushShow();
                });
            } else {
                const nowMS = TimerManager.get().getNowMS();
                const effectLastingMS = nowMS - this.effectStartTime;
                setTimeout(
                    () => {
                        this.flushShow();
                    },
                    effectLastingMS > this.minEffectTime
                        ? 0
                        : this.minEffectTime - effectLastingMS
                );
            }
        }
    }

    private flushShow() {
        this.setState({ show: this.show });
    }

    private renderWithEffect() {
        this.updateShow();
        let {
            borderWidth,
            borderColor,
            backgroundColor,
            borderRadius,
            boxShadow,
            transition,
            borderStyle,
        } = this.props;

        const effectElem = this.effectRef.current;
        const effectRect = effectElem
            ? effectElem.getBoundingClientRect()
            : { x: 0, y: 0, width: 0, height: 0 };

        const mousePT = PointerManager.get().getMouseLocation();
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

        return (
            <div
                ref={this.effectRef}
                style={{
                    position: "absolute",
                    inset: this.props.inset,
                    transition: makeTransition(
                        ["opacity"],
                        transition.durationMS + "ms",
                        transition.easing
                    ),
                    boxSizing: "border-box",
                    opacity: this.state.show ? this.props.maxOpacity : 0,
                    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius,
                    boxShadow: boxShadow,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: this.props.inset,
                        transition: makeTransition(
                            ["transform"],
                            transition.durationMS + "ms",
                            transition.easing
                        ),
                        transform: this.state.show ? "scale(1)" : "scale(0)",
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
        this.updateShow();

        let {
            borderWidth,
            borderColor,
            backgroundColor,
            borderRadius,
            boxShadow,
            transition,
            borderStyle,
        } = this.props;

        return (
            <div
                style={{
                    position: "absolute",
                    inset: this.props.inset,
                    transition: makeTransition(
                        ["opacity"],
                        transition.durationMS + "ms",
                        transition.easing
                    ),
                    boxSizing: "border-box",
                    opacity: this.state.show ? this.props.maxOpacity : 0,
                    backgroundColor: backgroundColor,
                    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius,
                    boxShadow: boxShadow,
                }}
            />
        );
    }

    render() {
        if (this.props.scaleEffect) {
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
    uiOpacity: { hover: number; active: number };
    uiBorder: UIStateConfig;
    uiBackground: UIStateConfig;
    uiShadow: UIStateConfig;
}

export class Background extends React.Component<BackgroundProps, {}> {
    private hasFrame: boolean = false;
    constructor(props: BackgroundProps) {
        super(props);
        this.state = {
            init: false,
        };
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
                !uiState.isDisabled &&
                (uiState.isHover ||
                    uiState.isActive ||
                    uiState.isSelected ||
                    isFocus);
        }

        return uiState.isDisabled ? (
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    backgroundColor: uiBackground.disabled,
                    border: `${borderWidth}px solid ${uiBorder.disabled}`,
                    borderRadius: borderRadius,
                    boxShadow: uiShadow.disabled,
                }}
            />
        ) : (
            <div
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                <Frame
                    show={true}
                    scaleEffect={false}
                    inset={0}
                    transition={theme.transition}
                    borderRadius={borderRadius}
                    maxOpacity={1}
                    borderStyle="solid"
                    borderWidth={borderWidth}
                    borderColor={uiBorder.normal}
                    backgroundColor={uiBackground.normal}
                    boxShadow={uiShadow.normal}
                />
                {this.hasFrame ? (
                    <>
                        <Frame
                            show={uiState.isHover}
                            scaleEffect={hoverScaleEffect}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            maxOpacity={uiOpacity.hover}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.hover}
                            backgroundColor={uiBackground.hover}
                            boxShadow={uiShadow.hover}
                        />
                        <Frame
                            show={uiState.isActive}
                            scaleEffect={activeScaleEffect}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            maxOpacity={uiOpacity.active}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.active}
                            backgroundColor={uiBackground.active}
                            boxShadow={uiShadow.active}
                        />
                        <Frame
                            show={uiState.isSelected}
                            scaleEffect={false}
                            inset={0}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            maxOpacity={1}
                            borderStyle="solid"
                            borderWidth={borderWidth}
                            borderColor={uiBorder.selected}
                            backgroundColor={uiBackground.selected}
                            boxShadow={uiShadow.selected}
                        />
                        <Frame
                            show={isFocus}
                            scaleEffect={false}
                            inset={focusInset}
                            transition={theme.transition}
                            borderRadius={borderRadius}
                            maxOpacity={1}
                            borderStyle={theme.focus.borderStyle}
                            borderWidth={theme.focus.borderWidth}
                            borderColor={theme.focus.borderColor}
                            backgroundColor={"transparent"}
                            boxShadow={""}
                        />
                    </>
                ) : null}
            </div>
        );
    }
}
