import React from "react";
import { FontWeight, getFontSize, Size, withDefault } from "../";
import { ActionSonar } from "../utils/action-sonar";
import { Theme, ThemeContext } from "../theme";

export type ButtonPalette = {
    icon?: string;
    label?: string;
    background?: string;
    hoverBackground?: string;
    activeBackground?: string;
    border?: string;
    outline?: string;
    shadow?: string;
};

export type ButtonCurrentState = {
    isGhost: boolean;
    isHover: boolean;
    isActive: boolean;
    isFocus: boolean;
    isSelected: boolean;
    isLoading: boolean;
};

interface ButtonProps {
    icon?: React.ReactNode;
    iconSize?: Size;
    label?: string;
    labelSize?: Size;
    fontWeight?: FontWeight;
    round: boolean;
    ghost: boolean;
    border: boolean;
    disabled: boolean;
    selected: boolean;
    focusable: boolean;
    width?: number;
    height?: number;
    borderRadius?: number;
    leftMargin?: number;
    middleMargin?: number;
    rightMargin?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowBlurRadius?: number;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => Promise<boolean>;
    onConfig?: (
        theme: Theme,
        currentState: ButtonCurrentState
    ) => ButtonPalette;
    renderBackground?: (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ) => React.ReactNode;
    renderFocus?: (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ) => React.ReactNode;
    renderHover?: (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ) => React.ReactNode;
    renderActive?: (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ) => React.ReactNode;
    renderContent?: (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
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

    private setLoading(loading: boolean) {
        if (this.loading !== loading) {
            this.loading = loading;
            this.setState({ loading: loading });
        }
    }

    private onConfigFill(
        theme: Theme,
        currentState: ButtonCurrentState
    ): ButtonPalette {
        const palette = theme.palette;
        let ret = {
            icon: palette.primary.contrastText,
            label: palette.primary.contrastText,
            background: palette.primary.main,
            hoverBackground: "transparent",
            activeBackground: "transparent",
            border: palette.primary.main,
            outline: "transparent",
            shadow: "transparent",
        };
        if (currentState.isFocus) {
            ret.outline = palette.focus.main;
        }
        if (currentState.isHover) {
            ret.icon = palette.hover.contrastText;
            ret.label = palette.hover.contrastText;
            ret.hoverBackground = palette.hover.main;
            ret.border = palette.hover.main;
            ret.outline = "transparent";
        }
        if (currentState.isActive) {
            ret.icon = palette.active.contrastText;
            ret.label = palette.active.contrastText;
            ret.activeBackground = palette.active.main;
            ret.border = palette.active.main;
            ret.shadow = palette.active.main;
            ret.outline = "transparent";
        }
        if (currentState.isSelected) {
            ret.icon = palette.selected.contrastText;
            ret.label = palette.selected.contrastText;
            ret.background = palette.selected.main;
            ret.border = palette.selected.main;
        }
        return ret;
    }

    private onConfigGhost(
        theme: Theme,
        currentState: ButtonCurrentState
    ): ButtonPalette {
        const palette = theme.palette;
        let ret = {
            icon: palette.primary.main,
            label: palette.primary.main,
            background: "transparent",
            hoverBackground: "transparent",
            activeBackground: "transparent",
            border: palette.primary.main,
            outline: "transparent",
            shadow: "transparent",
        };
        if (currentState.isFocus) {
            ret.outline = palette.focus.main;
        }
        if (currentState.isHover) {
            ret.icon = palette.hover.main;
            ret.label = palette.hover.main;
            ret.border = palette.hover.main;
            ret.outline = "transparent";
        }
        if (currentState.isActive) {
            ret.icon = palette.active.main;
            ret.label = palette.active.main;
            ret.border = palette.active.main;
            ret.shadow = palette.active.main;
            ret.outline = "transparent";
        }
        if (currentState.isSelected) {
            ret.icon = palette.selected.main;
            ret.label = palette.selected.main;
            ret.border = palette.selected.main;
        }
        return ret;
    }

    private onConfig(
        theme: Theme,
        currentState: ButtonCurrentState
    ): ButtonPalette {
        if (this.props.onConfig) {
            return this.props.onConfig(theme, currentState);
        } else if (this.props.ghost) {
            return this.onConfigGhost(theme, currentState);
        } else {
            return this.onConfigFill(theme, currentState);
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

    private getCurrentState = (): ButtonCurrentState => ({
        isGhost: this.props.ghost,
        isHover: this.state.hover,
        isActive: this.state.active,
        isFocus: this.state.focus,
        isSelected: this.props.selected,
        isLoading: this.loading,
    });

    private renderBackground = (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ): React.ReactNode => {
        if (this.props.renderBackground) {
            return this.props.renderBackground(theme, palette, currentState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: palette.background,
                    }}
                />
            );
        }
    };

    private renderHover = (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ): React.ReactNode => {
        if (this.props.renderHover) {
            return this.props.renderHover(theme, palette, currentState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: this.state.hover ? 1 : 0,
                        backgroundColor: palette.hoverBackground,
                    }}
                />
            );
        }
    };

    private renderActive = (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ): React.ReactNode => {
        if (this.props.renderActive) {
            return this.props.renderActive(theme, palette, currentState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: this.state.active ? 1 : 0,
                        backgroundColor: palette.activeBackground,
                    }}
                />
            );
        }
    };

    private renderFocus = (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ): React.ReactNode => {
        if (this.props.renderActive) {
            return this.props.renderActive(theme, palette, currentState);
        } else {
            return (
                <div
                    style={{
                        position: "absolute",
                        inset: 2,
                        opacity: this.state.focus ? 1 : 0,
                        border: `1px dash ${palette.outline}`,
                    }}
                />
            );
        }
    };

    private renderContent = (
        theme: Theme,
        palette: ButtonPalette,
        currentState: ButtonCurrentState
    ): React.ReactNode => {
        if (this.props.renderContent) {
            return this.props.renderContent(theme, palette, currentState);
        } else if (this.props.round) {
            return (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        flexFlow: "row",
                        userSelect: "none",
                    }}
                >
                    <div
                        style={{
                            color: palette.icon,
                            width: this.iconFontSize,
                            height: this.iconFontSize,
                            fontSize: this.iconFontSize,
                        }}
                    >
                        {this.props.icon}
                    </div>
                    <span
                        style={{
                            color: palette.label,
                            fontSize: this.labelFontSize,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {this.props.label}
                    </span>
                </div>
            );
        } else {
            const makeSpacerStyle = (
                value: number | undefined,
                defaultValue: number
            ): React.CSSProperties => {
                if (value !== undefined) {
                    return {
                        flex: 0,
                        minWidth: value,
                    };
                } else {
                    return {
                        flex: "1 0 0",
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
                        flexFlow: "row",
                        userSelect: "none",
                    }}
                >
                    <div
                        style={makeSpacerStyle(this.props.leftMargin, h / 4)}
                    />
                    <div
                        style={{
                            color: palette.icon,
                            width: this.iconFontSize,
                            height: this.iconFontSize,
                            fontSize: this.iconFontSize,
                        }}
                    >
                        {this.props.icon}
                    </div>
                    <div
                        style={{
                            display:
                                this.props.icon && this.props.label
                                    ? "display"
                                    : "none",
                            ...makeSpacerStyle(this.props.middleMargin, h / 8),
                        }}
                    />
                    <span
                        style={{
                            color: palette.label,
                            whiteSpace: "nowrap",
                            fontSize: this.labelFontSize,
                        }}
                    >
                        {this.props.label}
                    </span>
                    <div
                        style={makeSpacerStyle(this.props.rightMargin, h / 4)}
                    />
                </div>
            );
        }
    };

    render() {
        const theme: Theme = this.context;
        const currentState: ButtonCurrentState = this.getCurrentState();
        const palette: ButtonPalette = this.onConfig(theme, currentState);

        this.iconFontSize = getFontSize(
            withDefault(this.props.iconSize, theme.size)
        );
        this.labelFontSize = getFontSize(
            withDefault(this.props.labelSize, theme.size)
        );

        this.height = withDefault(
            this.props.height,
            Math.round(Math.max(this.iconFontSize, this.labelFontSize) * 2)
        );
        let borderRadius = withDefault(
            this.props.borderRadius,
            theme.borderRadius
        );

        return (
            <div
                ref={this.rootRef}
                onMouseMove={this.checkHover}
                onMouseDown={this.checkActive}
                onFocus={this.checkFocus}
                onClick={this.onClick}
                onKeyPress={this.onKeyPress}
                style={{
                    height: this.height,
                    borderStyle: "solid",
                    borderWidth: this.props.border ? 1 : 0,
                    borderColor: palette.border,
                    borderRadius: this.props.round
                        ? this.height / 2
                        : borderRadius,
                    overflow: "hidden",
                }}
            >
                <div
                    tabIndex={this.canFocus() ? 0 : -1}
                    style={{
                        width: withDefault(this.props.width, "auto"),
                        height: this.height,
                        outline: "none",
                        position: "relative",
                    }}
                >
                    {this.renderBackground(theme, palette, currentState)}
                    {this.renderFocus(theme, palette, currentState)}
                    {this.renderHover(theme, palette, currentState)}
                    {this.renderActive(theme, palette, currentState)}
                </div>

                <div
                    style={{
                        position: "relative",
                        top: -this.height,
                        height: this.height,
                        width: this.props.round ? this.height : "auto",
                    }}
                >
                    {this.renderContent(theme, palette, currentState)}
                </div>
            </div>
        );
    }
}
