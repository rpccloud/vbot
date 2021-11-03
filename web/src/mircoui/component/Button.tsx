import React, { CSSProperties } from "react";
import { getFontWeight } from "../../ui/theme/config";
import {
    ColorSet,
    getFontSize,
    Theme,
    ThemeCache,
    ThemeContext,
} from "../theme";
import { HtmlChecker } from "../util";

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
                font: theme.primary.auxiliary.darken(2).alpha(0.8).hsla,
                background: theme.primary.main.darken(2).alpha(0.8).hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            hover: {
                font: theme.primary.auxiliary.hsla,
                background: theme.primary.main.hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            active: {
                font: theme.primary.auxiliary.lighten(4).hsla,
                background: theme.primary.main.lighten(4).hsla,
                border: "transparent",
                shadow: theme.primary.main.hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.primary.auxiliary.hsla,
                background: theme.primary.main.hsla,
                border: "transparent",
                shadow: theme.primary.main.hsla,
                auxiliary: "transparent",
            },
            selected: {
                font: theme.primary.main.hsla,
                background: theme.primary.main.hsla,
                border: "transparent",
                shadow: "transparent",
                auxiliary: "transparent",
            },
            disabled: {
                font: theme.disabled.auxiliary.hsla,
                background: theme.disabled.main.hsla,
                border: theme.disabled.auxiliary.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
        },
        ghost: {
            normal: {
                font: theme.primary.main.darken(2).alpha(0.8).hsla,
                background: "transparent",
                border: theme.primary.main.darken(2).alpha(0.8).hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            hover: {
                font: theme.primary.main.hsla,
                background: "transparent",
                border: theme.primary.main.hsla,
                shadow: "transparent",
                auxiliary: "transparent",
            },
            active: {
                font: theme.primary.main.lighten(4).hsla,
                background: "transparent",
                border: theme.primary.main.lighten(4).hsla,
                shadow: theme.primary.main.hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.primary.main.hsla,
                background: "transparent",
                border: theme.primary.main.hsla,
                shadow: theme.primary.main.hsla,
                auxiliary: "transparent",
            },
            selected: {
                font: theme.primary.main.hsla,
                background: "transparent",
                border: theme.primary.main.hsla,
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

interface ButtonConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
    active?: ColorSet;
    selected?: ColorSet;
    disabled?: ColorSet;
}

interface ButtonProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    ghost: boolean;
    config: ButtonConfig;
    icon?: React.ReactNode;
    value: string;
    disabled: boolean;
    round: boolean;
    selected: boolean;
    focusable: boolean;
    border: boolean;
    style?: CSSProperties;
    onClick: () => void;
}

interface ButtonState {
    hover: boolean;
    active: boolean;
    focus: boolean;
}

export class Button extends React.Component<ButtonProps, ButtonState> {
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

    static contextType = ThemeContext;
    private rootRef: React.RefObject<HTMLButtonElement>;
    private htmlChecker: HtmlChecker;

    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            hover: false,
            active: false,
            focus: false,
        };
        this.rootRef = React.createRef<HTMLButtonElement>();
        this.htmlChecker = new HtmlChecker(this.rootRef);
    }

    render() {
        let size = getFontSize(this.props.size);
        let config: ButtonConfig = {
            ...getConfig(this.context, this.props.ghost),
            ...this.props.config,
        };

        let color = config.normal;

        if (this.props.selected) {
            color = config.selected;
        }

        if (this.state.hover) {
            color = config.hover;
        }

        if (this.state.active) {
            color = config.active;
        }

        if (this.props.disabled) {
            color = config.disabled;
        }

        let style = this.props.round
            ? {
                  width: 2 * size + 2,
                  height: 2 * size + 2,
                  padding: 0,
                  borderRadius: size,
                  ...this.props.style,
              }
            : {
                  padding: `${size / 2}px`,

                  ...this.props.style,
              };

        let canFocus = this.props.focusable && !this.props.disabled;

        return (
            <button
                tabIndex={canFocus ? 0 : -1}
                ref={this.rootRef}
                style={{
                    borderWidth: this.props.border ? 1 : 0,
                    borderStyle: "solid",
                    borderColor: this.props.border
                        ? color?.border
                        : "transparent",
                    color: color?.font,
                    fontSize: size,
                    fontWeight: getFontWeight(this.props.fontWeight),
                    backgroundColor: color?.background,
                    // lineHeight: `${size}px`,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                    boxShadow: this.props?.border
                        ? `0px 0px ${size / 4}px ${color?.shadow}`
                        : "",
                    ...style,
                }}
                onMouseMove={(e) => {
                    if (!this.state.hover) {
                        this.setState({ hover: true });
                        this.htmlChecker.onLostHover(() => {
                            this.setState({ hover: false });
                        });
                    }
                }}
                onMouseDownCapture={() => {
                    this.setState({ active: true });
                }}
                onMouseUpCapture={() => {
                    this.setState({ active: false });
                }}
                onClick={() => {
                    if (!this.props.disabled) {
                        this.props.onClick();
                    }
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexFlow: "row",
                        lineHeight: `${size}px`,
                        justifyContent: this.props.round ? "center" : "left",
                    }}
                >
                    {this.props.icon}
                    <span
                        style={{
                            width:
                                this.props.icon && this.props.value
                                    ? size / 3
                                    : 0,
                        }}
                    />
                    {this.props.value}
                </div>
            </button>
        );
    }
}
