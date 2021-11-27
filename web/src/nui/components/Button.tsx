import React from "react";
import {
    UIState,
    UIStateConfig,
    extendConfig,
    FontWeight,
    getFontSize,
    getStateColor,
    makeTransition,
    Size,
    UiCSSProperties,
    withDefault,
} from "../";
import { ActionSonar } from "../utils/action-sonar";
import { Theme, ThemeContext } from "../theme";
import { FadeBox } from "./FadeBox";
import { Spin } from "./Spin";
import { Background } from "./Background";

export interface ButtonConfig {
    startIcon?: UIStateConfig;
    endIcon?: UIStateConfig;
    label?: UIStateConfig;
    border?: UIStateConfig;
    shadow?: UIStateConfig;
    background?: UIStateConfig;
}

type RenderIconFunction = (
    theme: Theme,
    width: number,
    height: number,
    config: ButtonConfig,
    actionState: UIState
) => React.ReactNode;

type RenderLabelFunction = (actionState: UIState) => string;

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
    borderRadius?: number;
    style?: UiCSSProperties;
    loading?: "startIcon" | "endIcon" | "none";
    onClick: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
    renderContent?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: UIState
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
        loading: "startIcon",
        onClick: () => {},
    };

    private config?: ButtonConfig;
    private height = 0;
    private borderRadius = 0;
    private startIconFontSize = 0;
    private endIconFontSize = 0;
    private labelFontSize = 0;
    private rootRef = React.createRef<HTMLDivElement>();
    private loading: boolean = false;
    private actionSonar?: ActionSonar;

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
    }

    componentWillUnmount() {
        this.actionSonar?.close();
        this.actionSonar = undefined;
    }

    private getConfig(theme: Theme): ButtonConfig {
        const palette = theme.palette;

        const sy = this.height / 20;
        const sr = this.height / 10;
        const sc = this.props.shadowEffect ? palette.shadow : "transparent";

        const fgNormal = this.props.ghost
            ? palette.primary.main
            : palette.primary.contrastText;
        const fgHover = this.props.ghost
            ? palette.hover.main
            : palette.hover.contrastText;
        const fgActive = this.props.ghost
            ? palette.active.main
            : palette.active.contrastText;
        const fgSelected = this.props.ghost
            ? palette.selected.main
            : palette.selected.contrastText;

        return {
            startIcon: {
                normal: fgNormal,
                hover: fgHover,
                active: fgActive,
                selected: fgSelected,
                disabled: palette.disabled.contrastText,
            },
            endIcon: {
                normal: fgNormal,
                hover: fgHover,
                active: fgActive,
                selected: fgSelected,
                disabled: palette.disabled.contrastText,
            },
            label: {
                normal: fgNormal,
                hover: fgHover,
                active: fgActive,
                selected: fgSelected,
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
                selected: "",
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
        const theme: Theme = this.context;
        return (
            this.props.focusable &&
            theme.focus.focusable &&
            !this.props.disabled
        );
    };

    private checkHover = (e: React.MouseEvent<HTMLDivElement>) => {
        this.actionSonar?.checkHover(
            () => {
                this.setState({ hover: true });
            },
            () => {
                this.setState({ hover: false });
            }
        );
    };

    private checkFocus = () => {
        if (this.canFocus()) {
            this.actionSonar?.checkFocus(
                () => {
                    this.setState({ focus: true });
                },
                () => {
                    this.setState({ focus: false });
                }
            );
        }
    };

    private checkActive = () => {
        this.actionSonar?.checkActive(
            () => {
                this.setState({ active: true });
            },
            () => {
                this.setState({ active: false });
            }
        );
    };

    private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.disabled && !this.loading) {
            const v = this.props.onClick(e);
            if (v instanceof Promise) {
                this.setLoading(true);
                v.finally(() => {
                    this.setLoading(false);
                });
            }
        }
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.canFocus()) {
            this.rootRef.current?.click();
        }
    };

    private getCurrentState = (): UIState => ({
        isHover: this.state.hover,
        isActive: this.state.active,
        isSelected: this.props.selected,
        isDisabled: this.props.disabled || this.state.loading,
    });

    private renderContent = (
        theme: Theme,
        config: ButtonConfig,
        actionState: UIState
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

            const startIcon =
                typeof this.props.startIcon === "function" ? (
                    this.props.startIcon(
                        theme,
                        this.startIconFontSize,
                        this.startIconFontSize,
                        config,
                        actionState
                    )
                ) : this.props.loading === "startIcon" && this.state.loading ? (
                    <Spin size={this.props.startIconSize} />
                ) : (
                    this.props.startIcon
                );
            const endIcon =
                typeof this.props.endIcon === "function" ? (
                    this.props.endIcon(
                        theme,
                        this.endIconFontSize,
                        this.endIconFontSize,
                        config,
                        actionState
                    )
                ) : this.props.loading === "endIcon" && this.state.loading ? (
                    <Spin size={this.props.endIconSize} />
                ) : (
                    this.props.endIcon
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
                    {startIcon ? (
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
                            {startIcon}
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
                    {endIcon ? (
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
                            {endIcon}
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
            this.props.style?.height,
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

        const uiState = this.getCurrentState();

        return (
            <div
                ref={this.rootRef}
                onMouseMove={this.checkHover}
                onMouseDown={this.checkActive}
                onFocus={this.checkFocus}
                onClick={this.onClick}
                onKeyPress={this.onKeyPress}
                style={{
                    fontWeight: 600,
                    ...this.props.style,
                    display: "inline-block",
                    height: this.height,
                    cursor: this.props.disabled ? "not-allowed" : "pointer",
                }}
            >
                <Background
                    theme={theme}
                    hoverScaleEffect={this.props.hoverEffect}
                    activeScaleEffect={this.props.activeEffect}
                    isFocus={this.state.focus}
                    focusInset={this.height / 20}
                    borderWidth={1}
                    borderRadius={this.borderRadius}
                    uiState={uiState}
                    uiOpacity={{
                        normal: this.props.ghost ? 0 : 1,
                        hover: this.props.ghost
                            ? theme.button.ghost.hoverOpacity
                            : 1,
                        active: this.props.ghost
                            ? theme.button.ghost.activeOpacity
                            : 1,
                    }}
                    uiBorder={this.config?.border!!}
                    uiBackground={this.config?.background!!}
                    uiShadow={this.config?.shadow!!}
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
                            : withDefault(this.props.style?.width, "auto"),
                        borderRadius: this.borderRadius,
                        overflow: "hidden",
                        transition: makeTransition(
                            ["opacity", "color", "border", "box-shadow"],
                            theme.transition.durationMS + "ms",
                            theme.transition.easing
                        ),
                    }}
                >
                    {this.renderContent(theme, this.config!!, uiState)}
                </div>
            </div>
        );
    }
}
