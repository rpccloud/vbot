import React, { CSSProperties } from "react";
import { getFontWeight } from "../../ui/theme/config";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    ITheme,
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
                font: theme.primary.auxiliary.darken(3).alpha(0.8).hsla,
                background: theme.primary.main.darken(3).alpha(0.8).hsla,
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
                font: theme.primary.auxiliary.lighten(5).hsla,
                background: theme.primary.main.lighten(5).hsla,
                border: "transparent",
                shadow: theme.primary.main.lighten(5).hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.primary.auxiliary.hsla,
                background: theme.primary.main.hsla,
                border: theme.primary.main.lighten(5).hsla,
                shadow: "transparent",
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
                font: theme.primary.main.lighten(5).hsla,
                background: "transparent",
                border: theme.primary.main.lighten(5).hsla,
                shadow: theme.primary.main.lighten(5).hsla,
                auxiliary: "transparent",
            },
            focus: {
                font: theme.primary.main.hsla,
                background: "transparent",
                border: theme.primary.main.lighten(5).hsla,
                shadow: "transparent",
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
    style?: CSSProperties;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
        let config: ButtonConfig = getConfig(
            this.context.extend(this.props.theme),
            this.props.ghost
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        if (this.props.selected) {
            color = extendColorSet(config.selected, this.props.config.selected);
        }

        if (this.state.hover) {
            color = extendColorSet(config.hover, this.props.config.hover);
        }

        if (this.state.focus) {
            color = extendColorSet(config.focus, this.props.config.focus);
        }

        if (this.state.active) {
            color = extendColorSet(config.active, this.props.config.active);
        }

        if (this.props.disabled) {
            color = extendColorSet(config.disabled, this.props.config.disabled);
        }

        let style = this.props.round
            ? {
                  width: 2 * size + 2,
                  height: 2 * size + 2,
                  padding: `${size / 2}px 0px ${size / 2}px 0px`,
                  borderRadius: size,
                  ...this.props.style,
              }
            : {
                  padding: `${size / 2}px`,
                  ...this.props.style,
              };

        let canFocus = this.props.focusable && !this.props.disabled;
        let innerMargin = this.props.innerMargin
            ? this.props.innerMargin
            : size / 3;

        return (
            <button
                ref={this.rootRef}
                tabIndex={-1}
                style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: this.props.border
                        ? color.border
                        : "transparent",
                    color: color.font,
                    fontSize: size,
                    fontWeight: getFontWeight(this.props.fontWeight),
                    backgroundColor: color.background,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                    boxShadow: this.props?.border
                        ? `0px 0px ${size / 4}px ${color.shadow}`
                        : "",
                    ...style,
                }}
                onMouseMove={() => {
                    if (!this.state.hover) {
                        this.setState({ hover: true });
                        this.htmlChecker.onLostHover(() => {
                            this.setState({ hover: false });
                        });
                    }
                }}
                onMouseDown={() => {
                    if (!this.state.active) {
                        this.setState({ active: true });
                        this.htmlChecker.onLostActive(() => {
                            this.setState({ active: false });
                        });
                    }
                }}
                onFocus={(e) => {
                    if (!canFocus) {
                        e.preventDefault();
                        return;
                    }
                    if (!this.state.focus) {
                        this.setState({ focus: true });
                        this.htmlChecker.onLostFocus(() => {
                            this.setState({ focus: false });
                        });
                    }
                }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!this.props.disabled) {
                        this.props.onClick(e);
                    }
                }}
            >
                <div
                    tabIndex={canFocus ? 0 : -1}
                    style={{ width: 0, height: 0, opacity: 0 }}
                />

                <div
                    style={{
                        display: "flex",
                        flexFlow: "row",
                        lineHeight: `${size}px`,
                        justifyContent: this.props.style?.justifyContent
                            ? this.props.style?.justifyContent
                            : "center",
                    }}
                >
                    {this.props.icon}
                    <span
                        style={{
                            width:
                                this.props.icon && this.props.value
                                    ? innerMargin
                                    : 0,
                        }}
                    />
                    {this.props.value}
                </div>
            </button>
        );
    }
}
