import React, { CSSProperties, useContext } from "react";
import { getFontWeight } from "../../ui/theme/config";
import {
    ColorSet,
    extendColorSet,
    FocusContext,
    getFontSize,
    ITheme,
    Theme,
    ThemeCache,
    ThemeContext,
} from "../";
import { ActionSensor } from "../sensor/action";

interface ButtonConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
    active?: ColorSet;
    selected?: ColorSet;
    disabled?: ColorSet;
}

let themeCache = new ThemeCache();

function getConfig(theme: Theme, ghost: boolean): ButtonConfig {
    const themeKey = theme.hashKey();
    let record: { fill: ButtonConfig; ghost: ButtonConfig } =
        themeCache.getConfig(themeKey);
    if (record) {
        return ghost ? record.ghost : record.fill;
    }

    record = {
        fill: {
            normal: {
                font: theme.secondary.main.hsla,
                background: theme.secondary.auxiliary.hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            hover: {
                font: theme.primary.main.hsla,
                background: theme.primary.auxiliary.hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            active: {
                font: theme.primary.main.lighten(5).hsla,
                background: theme.primary.auxiliary.lighten(5).hsla,
                border: "transparent",
                shadow: theme.primary.auxiliary.lighten(5).hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.secondary.main.hsla,
                background: theme.secondary.auxiliary.hsla,
                border: theme.primary.auxiliary.lighten(5).hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            selected: {
                font: theme.primary.main.hsla,
                background: theme.primary.auxiliary.hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            disabled: {
                font: theme.disabled.main.hsla,
                background: theme.disabled.auxiliary.hsla,
                border: theme.disabled.main.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
        },
        ghost: {
            normal: {
                font: theme.secondary.auxiliary.hsla,
                background: "transparent",
                border: theme.secondary.auxiliary.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            hover: {
                font: theme.primary.auxiliary.hsla,
                background: "transparent",
                border: theme.primary.auxiliary.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            active: {
                font: theme.primary.auxiliary.lighten(5).hsla,
                background: "transparent",
                border: theme.primary.auxiliary.lighten(5).hsla,
                shadow: theme.primary.auxiliary.lighten(5).hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.secondary.auxiliary.hsla,
                background: "transparent",
                border: theme.primary.auxiliary.lighten(5).hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            selected: {
                font: theme.primary.auxiliary.hsla,
                background: "transparent",
                border: theme.primary.auxiliary.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            disabled: {
                font: theme.disabled.auxiliary.hsla,
                background: "transparent",
                border: theme.disabled.auxiliary.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
        },
    };

    themeCache.setConfig(themeKey, record);

    return ghost ? record.ghost : record.fill;
}

interface ButtonProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    ghost: boolean;
    theme?: ITheme;
    config: ButtonConfig;
    icon?: React.ReactNode;
    value: string;
    disabled: boolean;
    round: boolean;
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
        ghost: false,
        config: {},
        value: "",
        disabled: false,
        round: false,
        selected: false,
        border: true,
        focusable: true,
        onClick: () => void {},
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private actionSensor = new ActionSensor([this.rootRef]);

    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            hover: false,
            active: false,
            focus: false,
        };
    }

    componentWillUnmount() {
        this.actionSensor.close();
    }

    render() {
        let config: ButtonConfig = getConfig(
            this.context.extend(this.props.theme),
            this.props.ghost
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        if (this.state.focus) {
            color = extendColorSet(config.focus, this.props.config.focus);
        }

        if (this.props.selected) {
            color = extendColorSet(config.selected, this.props.config.selected);
        }

        if (this.state.hover) {
            color = extendColorSet(config.hover, this.props.config.hover);
        }

        if (this.state.active) {
            color = extendColorSet(config.active, this.props.config.active);
        }

        if (this.props.disabled) {
            color = extendColorSet(config.disabled, this.props.config.disabled);
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
                        color.border
                    }`,
                    color: color.font,
                    fontSize: fontSize,
                    padding: 0,
                    fontWeight: getFontWeight(this.props.fontWeight),
                    backgroundColor: color.background,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                    boxShadow: this.props?.border
                        ? `0px 0px ${qrHeight / 2}px ${color.shadow}`
                        : "",
                    ...style,
                }}
                onMouseMove={() => {
                    this.actionSensor.checkHover(
                        () => {
                            this.setState({ hover: true });
                        },
                        () => {
                            this.setState({ hover: false });
                        }
                    );
                }}
                onMouseDown={() => {
                    this.actionSensor.checkActive(
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
                        this.actionSensor.checkFocus(
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
