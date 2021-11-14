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
            normal: {
                font: theme.primary?.contrastText,
                background: theme.primary?.main,
                border: "transparent",
                shadow: "transparent",
            },
            hover: {
                font: theme.primary?.contrastText,
                background: theme.primary?.hover,
                border: "transparent",
                shadow: "transparent",
            },
            active: {
                font: theme.primary?.contrastText,
                background: theme.primary?.highlight,
                border: "transparent",
                shadow: theme.primary?.highlight,
            },
            focus: {
                font: theme.primary?.contrastText,
                background: theme.primary?.main,
                border: theme.primary?.highlight,
                shadow: "transparent",
            },
            selected: {
                font: theme.primary?.contrastText,
                background: theme.primary?.highlight,
                border: "transparent",
                shadow: "transparent",
            },
            disabled: {
                font: theme.disabled?.contrastText,
                background: theme.disabled?.main,
                border: theme.disabled?.contrastText,
                shadow: "transparent",
            },
        },
        ghost: {
            normal: {
                font: theme.primary?.main,
                background: "transparent",
                border: theme.primary?.main,
                shadow: "transparent",
            },
            hover: {
                font: theme.primary?.hover,
                background: "transparent",
                border: theme.primary?.hover,
                shadow: "transparent",
            },
            active: {
                font: theme.primary?.highlight,
                background: "transparent",
                border: theme.primary?.highlight,
                shadow: theme.primary?.highlight,
            },
            focus: {
                font: theme.primary?.main,
                background: "transparent",
                border: theme.primary?.highlight,
                shadow: "transparent",
            },
            selected: {
                font: theme.primary?.highlight,
                background: "transparent",
                border: theme.primary?.highlight,
                shadow: "transparent",
            },
            disabled: {
                font: theme.disabled?.contrastText,
                background: "transparent",
                border: theme.disabled?.contrastText,
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
    active: boolean;
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
            active: false,
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

        let colorSet = config.normal;

        if (this.state.focus) {
            colorSet = config.focus;
        }

        if (this.props.selected) {
            colorSet = config.selected;
        }

        if (this.state.hover) {
            colorSet = config.hover;
        }

        if (this.state.active) {
            colorSet = config.active;
        }

        if (this.props.disabled) {
            colorSet = config.disabled;
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
                        colorSet?.border
                    }`,
                    color: colorSet?.font,
                    fontSize: fontSize,
                    padding: 0,
                    fontWeight: getFontWeight(this.props.fontWeight),
                    backgroundColor: colorSet?.background,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                    boxShadow: this.props?.border
                        ? `0px 0px ${qrHeight / 2}px ${colorSet?.shadow}`
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
                            this.setState({ active: true });
                        },
                        () => {
                            this.setState({ active: false });
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
