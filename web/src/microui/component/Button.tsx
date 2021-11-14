import React, { CSSProperties, useContext } from "react";
import { getFontWeight } from "../../ui/theme/config";
import {
    extendConfig,
    extendTheme,
    getFontSize,
    getThemeHashKey,
    Theme,
} from "../config";
import { ActionSonar } from "../sonar/action";
import { ThemeContext } from "../context/theme";
import { FocusContext } from "../context/focus";
import { ButtonConfig } from "../config";
import { ThemeCache } from "../util";

let themeCache = new ThemeCache();

function getConfig(theme: Theme, ghost: boolean): ButtonConfig {
    const themeKey = getThemeHashKey(theme);
    let record: { fill: ButtonConfig; ghost: ButtonConfig } =
        themeCache.getConfig(themeKey);
    if (record) {
        return ghost ? record.ghost : record.fill;
    }

    record = {
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
                font: theme.focus?.contrastText,
                background: theme.focus?.main,
                border: theme.focus?.main,
                shadow: "transparent",
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
                font: theme.focus?.main,
                background: "transparent",
                border: theme.focus?.main,
                shadow: "transparent",
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
        },
    };

    themeCache.setConfig(themeKey, record);

    return ghost ? record.ghost : record.fill;
}

interface ButtonProps {
    size: "tiny" | "small" | "medium" | "large" | "xLarge" | "xxLarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: Theme;
    config: ButtonConfig;
    icon?: React.ReactNode;
    value: string;
    ghost: boolean;
    round: boolean;
    disabled: boolean;
    selected: boolean;
    focusable: boolean;
    border: boolean;
    innerMargin?: number;
    innerLeft?: number;
    innerRight?: number;
    style?: CSSProperties;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface ButtonState {
    hover: boolean;
    highlight: boolean;
    focus: boolean;
}

class ButtonCore extends React.Component<ButtonProps, ButtonState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        config: {},
        value: "",
        ghost: false,
        round: false,
        disabled: false,
        selected: false,
        focusable: true,
        border: true,
        onClick: () => void {},
    };

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
            getConfig(
                extendTheme(this.context, this.props.theme),
                this.props.ghost
            ),
            this.props.config
        );

        let color = config.primary;

        if (this.state.focus) {
            color = config.focus;
        }

        if (this.props.selected) {
            color = config.selected;
        }

        if (this.state.hover) {
            color = config.hover;
        }

        if (this.state.highlight) {
            color = config.highlight;
        }

        if (this.props.disabled) {
            color = config.disabled;
        }

        let fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);
        let qrHeight = Math.round(height / 4);
        let innerMargin =
            this.props.innerMargin !== undefined
                ? this.props.innerMargin
                : qrHeight;
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
                    border: `${this.props.border ? 1 : 0}px solid ${
                        color?.border
                    }`,
                    color: color?.font,
                    fontSize: fontSize,
                    padding: 0,
                    fontWeight: getFontWeight(this.props.fontWeight),
                    backgroundColor: color?.background,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
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
                        transition: "inherit",
                    }}
                >
                    {this.props.icon}
                    <span
                        style={{
                            width:
                                this.props.icon && this.props.value
                                    ? innerMargin
                                    : 0,
                            height: 0,
                        }}
                    />
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export const Button = (props: ButtonProps) => {
    const focusContext = useContext(FocusContext);
    return (
        <ButtonCore
            {...props}
            focusable={focusContext.focusable && props.focusable}
        />
    );
};

Button.defaultProps = ButtonCore.defaultProps;
