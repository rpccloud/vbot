import React from "react";
import {
    ActionState,
    ColorSet,
    extendConfig,
    FontWeight,
    getFontSize,
    getStateColor,
    getStateShadow,
    makeTransition,
    ShadowSet,
    Size,
    withDefault,
} from "../";
import { ActionSonar } from "../utils/action-sonar";
import { Theme, ThemeContext } from "../theme";
import { ActionBackground } from "../utils/active-background";
import { FadeBox } from "./FadeBox";

export interface ButtonConfig {
    startIcon?: ColorSet;
    endIcon?: ColorSet;
    label?: ColorSet;
    border?: ColorSet;
    shadow?: ShadowSet;
    background?: ColorSet;
}

type RenderIconFunction = (
    theme: Theme,
    width: number,
    height: number,
    config: ButtonConfig,
    actionState: ActionState
) => React.ReactNode;

type RenderLabelFunction = (actionState: ActionState) => string;

interface ButtonProps {
    round: boolean;
    ghost: boolean;
    border: boolean;
    disabled: boolean;
    selected: boolean;
    focusable: boolean;
    shadowEffect: boolean;
    hoverEffect: boolean;
    activeEffect: boolean;
    config?: ButtonConfig;
    label?: string | RenderLabelFunction;
    labelWidth?: number;
    labelSize?: Size;
    startMarginLeft?: number;
    startMarginRight?: number;
    startIcon?: React.ReactNode | RenderIconFunction;
    startIconSize?: Size;
    endMarginLeft?: number;
    endMarginRight?: number;
    endIcon?: React.ReactNode | RenderIconFunction;
    endIconSize?: Size;
    fontWeight?: FontWeight;
    width?: number;
    height?: number;
    borderRadius?: number;
    style?: React.CSSProperties;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => Promise<boolean>;
    renderContent?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
}

const makeSpacerStyle = (
    canFlex: boolean,
    value: number | undefined,
    defaultValue: number
): React.ReactNode => {
    return (
        <div
            style={{
                flex: value === undefined && canFlex ? 1 : 0,
                width: value !== undefined ? value : defaultValue,
                minWidth: value !== undefined ? value : 0,
            }}
        />
    );
};

interface ButtonState {
    hover: boolean;
    active: boolean;
    focus: boolean;
    loading: boolean;
}

export class Button extends React.Component<ButtonProps, ButtonState> {
    static contextType = ThemeContext;
    static defaultProps = {
        round: false,
        ghost: false,
        border: true,
        disabled: false,
        selected: false,
        focusable: true,
        shadowEffect: true,
        hoverEffect: false,
        activeEffect: true,
        onClick: () => {},
    };

    private config?: ButtonConfig;
    private height = 0;
    private borderRadius = 0;
    private startIconFontSize = 0;
    private endIconFontSize = 0;
    private labelFontSize = 0;
    private rootRef = React.createRef<HTMLDivElement>();
    private bgRef = React.createRef<HTMLDivElement>();
    private loading: boolean = false;
    private actionSonar?: ActionSonar;
    private background?: ActionBackground;

    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            hover: false,
            active: false,
            focus: false,
            loading: false,
        };
    }

    componentDidMount() {
        this.actionSonar = new ActionSonar([this.rootRef]);

        if (this.bgRef.current) {
            this.background = new ActionBackground(this.bgRef.current);
        }
    }

    componentWillUnmount() {
        this.actionSonar?.close();
        this.actionSonar = undefined;
        this.background = undefined;
    }

    private getConfig(theme: Theme): ButtonConfig {
        const palette = theme.palette;

        const sy = this.height / 20;
        const sr = this.height / 10;
        const sc = palette.shadow;

        return {
            startIcon: {
                normal: palette.primary.contrastText,
                hover: palette.hover.contrastText,
                active: palette.active.contrastText,
                selected: palette.selected.contrastText,
                disabled: palette.disabled.contrastText,
            },
            endIcon: {
                normal: palette.primary.contrastText,
                hover: palette.hover.contrastText,
                active: palette.active.contrastText,
                selected: palette.selected.contrastText,
                disabled: palette.disabled.contrastText,
            },
            label: {
                normal: palette.primary.contrastText,
                hover: palette.hover.contrastText,
                active: palette.active.contrastText,
                selected: palette.selected.contrastText,
                disabled: palette.disabled.contrastText,
            },
            border: {
                normal: palette.primary.main,
                hover: palette.hover.main,
                active: palette.active.main,
                selected: palette.selected.main,
                disabled: palette.disabled.contrastText,
            },
            shadow: {
                normal: `0px ${sy}px ${sr}px ${sc}`,
                hover: `0px ${sy * 2}px ${sr * 2}px ${sc}`,
                active: `0px ${sy * 3}px ${sr * 3}px ${sc}`,
                disabled: "",
            },
            background: {
                normal: palette.primary.main,
                hover: palette.hover.main,
                active: palette.active.main,
                selected: palette.selected.main,
                disabled: palette.disabled.main,
            },
        };
    }

    private setLoading(loading: boolean) {
        if (this.loading !== loading) {
            this.loading = loading;
            this.setState({ loading: loading });
        }
    }

    private canFocus = (): boolean => {
        return this.props.focusable && !this.props.disabled;
    };

    private checkHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.disabled) {
            return;
        }

        const theme: Theme = this.context;
        this.actionSonar?.checkHover(
            () => {
                this.setState({ hover: true });
                this.background?.setHover(
                    true,
                    this.config?.background?.hover || "transparent",
                    this.props.ghost ? theme.ghostButton.hoverOpacity : 1,
                    this.props.hoverEffect,
                    theme.transition
                );
            },
            () => {
                this.setState({ hover: false });
                this.background?.setHover(
                    false,
                    "",
                    0,
                    this.props.hoverEffect,
                    theme.transition
                );
            }
        );
    };

    private checkFocus = () => {
        const theme: Theme = this.context;
        if (this.canFocus()) {
            this.actionSonar?.checkFocus(
                () => {
                    this.setState({ focus: true });
                    this.background?.setFocus(
                        true,
                        theme.palette.focus,
                        "dashed",
                        1,
                        this.height / 20,
                        this.borderRadius
                    );
                },
                () => {
                    this.setState({ focus: false });
                    this.background?.setFocus(
                        false,
                        theme.palette.focus,
                        "dashed",
                        1,
                        this.height / 25,
                        this.borderRadius
                    );
                }
            );
        }
    };

    private checkActive = () => {
        if (this.props.disabled) {
            return;
        }

        const theme: Theme = this.context;

        this.actionSonar?.checkActive(
            () => {
                this.setState({ active: true });
                this.background?.setActive(
                    true,
                    this.config?.background?.active || "transparent",
                    this.props.ghost ? theme.ghostButton.activeOpacity : 1,
                    this.props.activeEffect,
                    theme.transition
                );
            },
            () => {
                this.setState({ active: false });
                this.background?.setActive(
                    false,
                    this.config?.background?.active || "transparent",
                    this.props.ghost ? theme.ghostButton.activeOpacity : 1,
                    this.props.activeEffect,
                    theme.transition
                );
            }
        );
    };

    private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.canFocus()) {
            this.rootRef.current?.click();
        }
    };

    private getCurrentState = (): ActionState => ({
        isHover: this.state.hover,
        isActive: this.state.active,
        isSelected: this.props.selected,
        isDisabled: this.props.disabled || this.state.loading,
    });

    private renderContent = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderContent) {
            return this.props.renderContent(theme, config, actionState);
        } else {
            const h = this.height;

            const canStartFlex =
                !!this.props.startIcon &&
                (!!this.props.label || !!this.props.endIcon);
            const canEndFlex =
                !!this.props.endIcon &&
                (!!this.props.label || !!this.props.startIcon);

            const labelView = (
                <span
                    style={{
                        color: getStateColor(config.label, actionState),
                        whiteSpace: "nowrap",
                        fontSize: this.labelFontSize,
                        transition: "inherit",
                        overflow: "hidden",
                        flex: "none",
                    }}
                >
                    {typeof this.props.label === "function"
                        ? this.props.label(actionState)
                        : this.props.label}
                </span>
            );
            return (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: this.props.round
                            ? "center"
                            : "flex-start",
                        flexFlow: "row",
                        userSelect: "none",
                        transition: "inherit",
                    }}
                >
                    {makeSpacerStyle(true, this.props.startMarginLeft, h / 2)}
                    {this.props.startIcon ? (
                        <div
                            style={{
                                color: getStateColor(
                                    config.startIcon,
                                    actionState
                                ),
                                width: this.startIconFontSize,
                                height: this.startIconFontSize,
                                fontSize: this.startIconFontSize,
                                transition: "inherit",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {typeof this.props.startIcon === "function"
                                ? this.props.startIcon(
                                      theme,
                                      this.startIconFontSize,
                                      this.startIconFontSize,
                                      config,
                                      actionState
                                  )
                                : this.props.startIcon}
                        </div>
                    ) : null}
                    {makeSpacerStyle(
                        canStartFlex,
                        this.props.startMarginRight,
                        0
                    )}
                    {this.props.label ? (
                        this.props.labelWidth === undefined ? (
                            labelView
                        ) : (
                            <FadeBox
                                style={{
                                    minWidth: this.props.labelWidth,
                                    flex: 0,
                                }}
                                fade={
                                    (0.6 * this.labelFontSize) /
                                    this.props.labelWidth
                                }
                            >
                                {labelView}
                            </FadeBox>
                        )
                    ) : null}
                    {makeSpacerStyle(canEndFlex, this.props.endMarginLeft, 0)}
                    {this.props.endIcon ? (
                        <div
                            style={{
                                color: getStateColor(
                                    config.endIcon,
                                    actionState
                                ),
                                width: this.endIconFontSize,
                                height: this.endIconFontSize,
                                fontSize: this.endIconFontSize,
                                transition: "inherit",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {typeof this.props.endIcon === "function"
                                ? this.props.endIcon(
                                      theme,
                                      this.endIconFontSize,
                                      this.endIconFontSize,
                                      config,
                                      actionState
                                  )
                                : this.props.endIcon}
                        </div>
                    ) : null}
                    {makeSpacerStyle(true, this.props.endMarginRight, h / 2)}
                </div>
            );
        }
    };

    private updateConfig() {
        const theme: Theme = this.context;

        this.startIconFontSize = getFontSize(
            withDefault(this.props.startIconSize, theme.size)
        );
        this.endIconFontSize = getFontSize(
            withDefault(this.props.endIconSize, theme.size)
        );
        this.labelFontSize = getFontSize(
            withDefault(this.props.labelSize, theme.size)
        );
        this.height = withDefault(
            this.props.height,
            Math.round(
                Math.max(
                    this.startIconFontSize,
                    this.endIconFontSize,
                    this.labelFontSize
                ) * 2.3
            )
        );

        this.config = extendConfig(this.getConfig(theme), this.props.config);
        this.borderRadius = this.props.round
            ? this.height / 2 + 1
            : withDefault(this.props.borderRadius, theme.borderRadius);
    }

    render() {
        const theme: Theme = this.context;
        this.updateConfig();

        const actionState = this.getCurrentState();
        const borderColor = this.props.border
            ? getStateColor(this.config?.border, actionState)
            : "transparent";

        return (
            <div
                ref={this.rootRef}
                onMouseMove={this.checkHover}
                onMouseDown={this.checkActive}
                onFocus={this.checkFocus}
                onClick={this.onClick}
                onKeyPress={this.onKeyPress}
                style={{
                    ...this.props.style,
                    display: "inline-block",
                    height: this.height,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderTopColor: borderColor,
                    borderLeftColor: borderColor,
                    borderRightColor: borderColor,
                    borderBottomColor: borderColor,
                    borderRadius: this.borderRadius,
                    transition: makeTransition(
                        ["opacity", "color", "border", "box-shadow"],
                        theme.transition.durationMS + "ms",
                        theme.transition.easing
                    ),
                    overflow: "hidden",
                    cursor: this.props.disabled ? "not-allowed" : "pointer",
                    boxShadow: this.props.shadowEffect
                        ? getStateShadow(this.config?.shadow, actionState)
                        : "",
                }}
            >
                <div
                    ref={this.bgRef}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        backgroundColor: this.props.ghost
                            ? "transparent"
                            : this.props.disabled
                            ? this.config?.background?.disabled
                            : this.config?.background?.normal,
                        transition: "inherit",
                    }}
                />

                <div
                    tabIndex={this.canFocus() ? 0 : -1}
                    style={{
                        position: "relative",
                        outline: "none",
                        top: -this.height,
                        height: this.height,
                        width: this.props.round
                            ? this.height
                            : withDefault(this.props.width, "auto"),
                        transition: "inherit",
                    }}
                >
                    {this.renderContent(theme, this.config!!, actionState)}
                </div>
            </div>
        );
    }
}
