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

export interface ButtonConfig {
    icon?: ColorSet;
    label?: ColorSet;
    border?: ColorSet;
    shadow?: ShadowSet;
    background?: ColorSet;
}

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
    icon?: React.ReactNode;
    iconSize?: Size;
    label?: string;
    labelSize?: Size;
    fontWeight?: FontWeight;
    width?: number;
    height?: number;
    borderRadius?: number;
    leftMargin?: number;
    middleMargin?: number;
    rightMargin?: number;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => Promise<boolean>;
    renderBackground?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
    renderFocus?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
    renderHover?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
    renderActive?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
    renderContent?: (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ) => React.ReactNode;
}

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
        activeEffect: false,
        onClick: () => {},
    };

    private height = 0;
    private iconFontSize = 0;
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
        const sc = palette.shadow;

        if (this.props.ghost) {
            return {
                icon: {
                    normal: palette.primary.main,
                    hover: palette.hover.main,
                    active: palette.active.main,
                    selected: palette.selected.main,
                },
                label: {
                    normal: palette.primary.main,
                    hover: palette.hover.main,
                    active: palette.active.main,
                    selected: palette.selected.main,
                },
                border: {
                    normal: palette.primary.main,
                    hover: palette.hover.main,
                    active: palette.active.main,
                    selected: palette.selected.main,
                },
                shadow: {
                    normal: `0px ${sy}px ${sr}px ${sc}`,
                    hover: `0px ${sy * 2}px ${sr * 2}px ${sc}`,
                    active: `0px ${sy * 3}px ${sr * 3}px ${sc}`,
                },
                background: {
                    normal: "transparent",
                    hover: "transparent",
                    active: "transparent",
                    selected: "transparent",
                },
            };
        } else {
            return {
                icon: {
                    normal: palette.primary.contrastText,
                    hover: palette.hover.contrastText,
                    active: palette.active.contrastText,
                    selected: palette.selected.contrastText,
                },
                label: {
                    normal: palette.primary.contrastText,
                    hover: palette.hover.contrastText,
                    active: palette.active.contrastText,
                    selected: palette.selected.contrastText,
                },
                border: {
                    normal: palette.primary.main,
                    hover: palette.hover.main,
                    active: palette.active.main,
                    selected: palette.selected.main,
                },
                shadow: {
                    normal: `0px ${sy}px ${sr}px ${sc}`,
                    hover: `0px ${sy * 2}px ${sr * 2}px ${sc}`,
                    active: `0px ${sy * 3}px ${sr * 3}px ${sc}`,
                },
                background: {
                    normal: palette.primary.main,
                    hover: palette.hover.main,
                    active: palette.active.main,
                    selected: palette.selected.main,
                },
            };
        }
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

    private checkHover = () => {
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
    });

    private renderBackground = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderBackground) {
            return this.props.renderBackground(theme, config, actionState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        opacity: this.props.ghost ? 0 : 1,
                        backgroundColor: config.background?.normal,
                    }}
                />
            );
        }
    };

    private renderHover = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderHover) {
            return this.props.renderHover(theme, config, actionState);
        } else {
            const showOpacity = this.props.ghost
                ? theme.ghostButton.hoverOpacity
                : 1;
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: this.state.hover ? showOpacity : 0,
                        transition: "inherit",
                        backgroundColor: theme.palette.hover.main,
                    }}
                />
            );
        }
    };

    private renderActive = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderActive) {
            return this.props.renderActive(theme, config, actionState);
        } else {
            const showOpacity = this.props.ghost
                ? theme.ghostButton.activeOpacity
                : 1;
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: this.state.active ? showOpacity : 0,
                        transition: "inherit",
                        backgroundColor: theme.palette.active.main,
                    }}
                />
            );
        }
    };

    private renderFocus = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderFocus) {
            return this.props.renderFocus(theme, config, actionState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        margin: 2,
                        opacity: this.state.focus ? 1 : 0,
                        borderRadius: this.props.round
                            ? this.height / 2
                            : withDefault(
                                  this.props.borderRadius,
                                  theme.borderRadius
                              ),
                        border: `1px dashed ${theme.palette.focus}`,
                        transition: "inherit",
                    }}
                />
            );
        }
    };

    private renderContent = (
        theme: Theme,
        config: ButtonConfig,
        actionState: ActionState
    ): React.ReactNode => {
        if (this.props.renderContent) {
            return this.props.renderContent(theme, config, actionState);
        } else {
            const makeSpacerStyle = (
                display: boolean,
                value: number | undefined,
                defaultValue: number
            ): React.CSSProperties => {
                if (value !== undefined) {
                    return {
                        flex: 0,
                        display: display ? "flex" : "none",
                        minWidth: value,
                    };
                } else {
                    return {
                        flex: "1 0 0",
                        display: display ? "block" : "none",
                        minWidth: defaultValue,
                    };
                }
            };
            const h = this.height;
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
                    <div
                        style={makeSpacerStyle(
                            !this.props.round,
                            this.props.leftMargin,
                            h / 4
                        )}
                    />
                    <div
                        style={{
                            display: this.props.icon ? "block" : "none",
                            color: getStateColor(config.icon, actionState),
                            width: this.iconFontSize,
                            height: this.iconFontSize,
                            fontSize: this.iconFontSize,
                            transition: "inherit",
                        }}
                    >
                        {this.props.icon}
                    </div>
                    <div
                        style={{
                            ...makeSpacerStyle(
                                !this.props.round &&
                                    !!this.props.icon &&
                                    !!this.props.label,
                                this.props.middleMargin,
                                h / 8
                            ),
                        }}
                    />
                    <span
                        style={{
                            display: this.props.label ? "block" : "none",
                            color: getStateColor(config.label, actionState),
                            whiteSpace: "nowrap",
                            fontSize: this.labelFontSize,
                            transition: "inherit",
                        }}
                    >
                        {this.props.label}
                    </span>
                    <div
                        style={makeSpacerStyle(
                            !this.props.round,
                            this.props.rightMargin,
                            h / 4
                        )}
                    />
                </div>
            );
        }
    };

    render() {
        const theme: Theme = this.context;

        this.iconFontSize = getFontSize(
            withDefault(this.props.iconSize, theme.size)
        );
        this.labelFontSize = getFontSize(
            withDefault(this.props.labelSize, theme.size)
        );
        this.height = withDefault(
            this.props.height,
            Math.round(Math.max(this.iconFontSize, this.labelFontSize) * 2.3)
        );

        const config: ButtonConfig = extendConfig(
            this.getConfig(theme),
            this.props.config
        );
        const actionState = this.getCurrentState();
        const borderColor = getStateColor(config.border, actionState);

        return (
            <div
                ref={this.rootRef}
                onMouseMove={this.checkHover}
                onMouseDown={this.checkActive}
                onFocus={this.checkFocus}
                onClick={this.onClick}
                onKeyPress={this.onKeyPress}
                style={{
                    display: "block",
                    height: this.height,
                    borderStyle: "solid",
                    borderWidth: this.props.border ? 1 : 0,
                    borderTopColor: borderColor,
                    borderLeftColor: borderColor,
                    borderRightColor: borderColor,
                    borderBottomColor: borderColor,
                    borderRadius: this.props.round
                        ? this.height / 2
                        : withDefault(
                              this.props.borderRadius,
                              theme.borderRadius
                          ),
                    transition: makeTransition(
                        ["opacity", "color", "border", "box-shadow"],
                        theme.transition.durationMS + "ms",
                        theme.transition.easing
                    ),
                    overflow: "hidden",
                    boxShadow: this.props.shadowEffect
                        ? getStateShadow(config.shadow, actionState)
                        : "",
                }}
            >
                <div
                    tabIndex={this.canFocus() ? 0 : -1}
                    style={{
                        width: withDefault(this.props.width, "auto"),
                        height: this.height,
                        outline: "none",
                        position: "relative",
                        transition: "inherit",
                    }}
                >
                    {this.renderBackground(theme, config, actionState)}
                    {this.renderFocus(theme, config, actionState)}
                    {this.renderHover(theme, config, actionState)}
                    {this.renderActive(theme, config, actionState)}
                </div>

                <div
                    style={{
                        position: "relative",
                        top: -this.height,
                        height: this.height,
                        width: this.props.round ? this.height : "auto",
                        transition: "inherit",
                    }}
                >
                    {this.renderContent(theme, config, actionState)}
                </div>
            </div>
        );
    }
}
