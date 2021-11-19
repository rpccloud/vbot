import React, { CSSProperties, useContext } from "react";
import {
    ComponentColor,
    extendConfig,
    getFontSize,
    makeTransition,
    Size,
    Transition,
} from "../util";
import { ActionSonar } from "../sonar/action";
import { extendTheme, Theme, ThemeCache, ThemeContext } from "../context/theme";
import { FocusContext } from "../context/focus";
import { SizeContext } from "../context/size";
import { BorderRadiusContext } from "../context/borderRadius";

let themeCache = new ThemeCache((theme) => ({
    fill: {
        primary: {
            font: theme.primary?.contrastText,
            background: theme.primary?.main,
            border: theme.primary?.main,
            shadow: "transparent",
        },
        hover: {
            font: theme.hover?.contrastText,
            background: theme.hover?.main,
            border: theme.hover?.main,
            shadow: "transparent",
        },
        highlight: {
            font: theme.highlight?.contrastText,
            background: theme.highlight?.main,
            border: theme.highlight?.main,
            shadow: theme.highlight?.main,
        },
        focus: {
            border: theme.focus?.main,
        },
        selected: {
            font: theme.selected?.contrastText,
            background: theme.selected?.main,
            border: theme.selected?.main,
            shadow: "transparent",
        },
        disabled: {
            font: theme.disabled?.contrastText,
            background: theme.disabled?.main,
            border: theme.disabled?.main,
            shadow: "transparent",
        },
        transition: theme.transition,
    },
    ghost: {
        primary: {
            font: theme.primary?.main,
            background: "transparent",
            border: theme.primary?.main,
            shadow: "transparent",
        },
        hover: {
            font: theme.hover?.main,
            background: "transparent",
            border: theme.hover?.main,
            shadow: "transparent",
        },
        highlight: {
            font: theme.highlight?.main,
            background: "transparent",
            border: theme.highlight?.main,
            shadow: theme.highlight?.main,
        },
        focus: {
            border: theme.focus?.main,
        },
        selected: {
            font: theme.selected?.main,
            background: "transparent",
            border: theme.selected?.main,
            shadow: "transparent",
        },
        disabled: {
            font: theme.disabled?.main,
            background: "transparent",
            border: theme.disabled?.main,
            shadow: "transparent",
        },
        transition: theme.transition,
    },
}));

export type ButtonConfig = {
    primary?: ComponentColor;
    hover?: ComponentColor;
    focus?: ComponentColor;
    highlight?: ComponentColor;
    selected?: ComponentColor;
    disabled?: ComponentColor;
    transition?: Transition;
};

interface ButtonProps {
    size?: Size;
    theme?: Theme;
    config: ButtonConfig;
    icon?: React.ReactNode;
    text: string;
    ghost: boolean;
    round: boolean;
    disabled: boolean;
    selected: boolean;
    focusable: boolean;
    border: boolean;
    borderRadius?: number;
    innerMargin?: number;
    innerLeft?: number;
    innerRight?: number;
    style?: CSSProperties;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onEnter: () => void;
}

interface ButtonState {
    hover: boolean;
    highlight: boolean;
    focus: boolean;
}

class ButtonCore extends React.Component<ButtonProps, ButtonState> {
    static contextType = ThemeContext;
    private rootRef = React.createRef<HTMLDivElement>();
    private actionSonar = new ActionSonar([this.rootRef]);

    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            hover: false,
            highlight: false,
            focus: false,
        };
    }

    componentWillUnmount() {
        this.actionSonar.close();
    }

    render() {
        let config: ButtonConfig = extendConfig(
            themeCache.getConfig(extendTheme(this.context, this.props.theme))[
                this.props.ghost ? "ghost" : "fill"
            ],
            this.props.config
        );

        let color = config.primary;

        if (this.state.hover) {
            color = config.hover;
        }

        if (this.state.highlight) {
            color = config.highlight;
        }

        if (this.props.disabled) {
            color = config.disabled;
        }

        if (this.props.selected) {
            color = config.selected;
        }
        if (this.state.focus) {
            color = { ...color, ...config.focus };
        }

        let fontSize = getFontSize(this.props.size || "medium");
        let height = Math.round(fontSize * 2.4);
        let qrHeight = Math.round(height / 4);
        let innerMargin =
            this.props.innerMargin !== undefined
                ? this.props.innerMargin
                : Math.round(height / 5);
        let innerLeft =
            this.props.innerLeft !== undefined
                ? this.props.innerLeft
                : qrHeight;
        let innerRight =
            this.props.innerRight !== undefined
                ? this.props.innerRight
                : qrHeight;

        let style = this.props.round
            ? {
                  width: height,
                  height: height,
                  borderRadius: height / 2,
                  ...this.props.style,
              }
            : {
                  width: "auto",
                  height: height,
                  ...this.props.style,
              };

        let canFocus =
            this.props.focusable && !this.props.disabled && !this.state.focus;

        let padding =
            this.props?.style?.padding !== undefined
                ? this.props?.style?.padding
                : `0px ${innerRight}px 0px ${innerLeft}px`;

        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "block",
                    borderStyle: "solid",
                    borderWidth: this.props.border ? 1 : 0,
                    borderTopColor: color?.border,
                    borderLeftColor: color?.border,
                    borderBottomColor: color?.border,
                    borderRightColor: color?.border,
                    borderRadius: this.props.borderRadius,
                    color: color?.font,
                    fontSize: fontSize,
                    fontWeight: 600,
                    padding: 0,
                    backgroundColor: color?.background,
                    transition: makeTransition(
                        ["background", "color", "border", "box-shadow"],
                        config.transition?.duration,
                        config.transition?.easing
                    ),
                    cursor: this.props.disabled ? "not-allowed" : "pointer",
                    boxShadow: this.props?.border
                        ? `0px 0px ${qrHeight / 2}px ${color?.shadow}`
                        : "",
                    ...style,
                }}
                onMouseMove={() => {
                    this.actionSonar.checkHover(
                        () => {
                            this.setState({ hover: true });
                        },
                        () => {
                            this.setState({ hover: false });
                        }
                    );
                }}
                onMouseDown={() => {
                    this.actionSonar.checkActive(
                        () => {
                            this.setState({ highlight: true });
                        },
                        () => {
                            this.setState({ highlight: false });
                        }
                    );
                }}
                onFocus={(e) => {
                    if (canFocus) {
                        this.actionSonar.checkFocus(
                            () => {
                                this.setState({ focus: true });
                            },
                            () => {
                                this.setState({ focus: false });
                            }
                        );
                    }
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!this.props.disabled) {
                        this.props.onClick(e);
                    }
                }}
                onKeyPress={(e) => {
                    if (
                        !e.ctrlKey &&
                        !e.altKey &&
                        !e.shiftKey &&
                        e.code === "Enter"
                    ) {
                        this.props.onEnter();
                    }
                }}
            >
                <div
                    tabIndex={canFocus ? 0 : -1}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent:
                            this.props.style?.justifyContent || "center",
                        alignItems: this.props.style?.alignItems || "center",
                        padding: this.props.round ? 0 : padding,
                    }}
                >
                    {this.props.icon}
                    <span
                        style={{
                            width:
                                this.props.icon && this.props.text
                                    ? innerMargin
                                    : 0,
                            height: 0,
                        }}
                    />
                    {this.props.text}
                </div>
            </div>
        );
    }
}

export const Button = (props: ButtonProps) => {
    const { focusable } = useContext(FocusContext);
    const { size } = useContext(SizeContext);
    const { borderRadius } = useContext(BorderRadiusContext);
    return (
        <ButtonCore
            {...props}
            size={props.size || size}
            focusable={focusable && props.focusable}
            borderRadius={
                props.borderRadius !== undefined
                    ? props.borderRadius
                    : borderRadius
            }
        />
    );
};

Button.defaultProps = {
    fontWeight: "normal",
    config: {},
    text: "",
    ghost: false,
    round: false,
    disabled: false,
    selected: false,
    focusable: true,
    border: true,
    onClick: () => void {},
    onEnter: () => {},
};
