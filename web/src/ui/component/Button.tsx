import React, { CSSProperties, useContext, useRef, useState } from "react";
import {
    getFontSize,
    getFontWeight,
    IColorUnit,
    ThemeConfig,
    ThemeContext,
} from "../theme/config";
import { HtmlChecker } from "../util/util";

let themeCache: { key: string; config: IButtonContextProps } = {
    key: "",
    config: {},
};

function getConfig(theme: ThemeConfig): IButtonContextProps {
    const themeKey = theme.hashKey();

    if (themeCache.key === themeKey) {
        return themeCache.config;
    }

    let config = {
        normal: {
            font: theme.primaryColor.alpha(0.6).hsla,
            border: theme.primaryColor.alpha(0.6).hsla,
        },
        hover: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
        },
        active: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
            shadow: theme.primaryColor.hsla,
        },
        focus: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
        },
        selected: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
        },
        disabled: {
            font: theme.disabledColor.hsla,
            border: theme.disabledColor.hsla,
        },
        warning: {
            font: theme.warningColor.hsla,
            border: theme.warningColor.hsla,
        },
    };

    themeCache.key = themeKey;
    themeCache.config = config;

    return config;
}

interface IButtonContextProps {
    normal?: IColorUnit;
    hover?: IColorUnit;
    active?: IColorUnit;
    focus?: IColorUnit;
    selected?: IColorUnit;
    disabled?: IColorUnit;
}

export const ButtonContext = React.createContext<IButtonContextProps>({});

interface ButtonProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    icon?: React.ReactElement;
    value: string;
    disabled: boolean;
    round: boolean;
    selected: boolean;
    border: boolean;
    expand: boolean;
    style?: CSSProperties;
    onClick?: () => void;
}

const Button = (props: ButtonProps) => {
    const buttonElem = useRef<HTMLDivElement>(null);
    const themeConfig = getConfig(useContext(ThemeContext));
    const contextConfig = useContext(ButtonContext);
    let [active, setActive] = useState(false);
    let [hover, setHover] = useState(false);
    let htmlChecker = new HtmlChecker(buttonElem);

    let size = getFontSize(props.size);
    let color = { ...themeConfig.normal, ...contextConfig.normal };

    if (props.selected) {
        color = { ...themeConfig.selected, ...contextConfig.selected };
    }

    if (hover) {
        color = { ...themeConfig.hover, ...contextConfig.hover };
    }

    if (active) {
        color = { ...themeConfig.active, ...contextConfig.active };
    }

    if (props.disabled) {
        color = { ...themeConfig.disabled, ...contextConfig.disabled };
    }

    let style = {};
    if (props.round) {
        style = {
            width: `${2 * size}px`,
            height: `${2 * size}px`,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: size,
            ...props.style,
        };
    } else {
        style = {
            padding: `${size / 2}px ${size}px ${size / 2}px ${size}px`,
            ...props.style,
        };
    }

    console.log(color);

    return (
        <div
            ref={buttonElem}
            style={{
                display: props.expand ? "flex" : "inline-flex",
                borderWidth: props.border ? 1 : 0,
                borderStyle: "solid",
                borderColor: color.border,
                fontSize: size,
                flexFlow: "row",
                background: color.background,
                color: color.font,
                fontWeight: getFontWeight(props.fontWeight),
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                boxShadow: color.shadow
                    ? `0px 0px ${size / 4}px ${color.shadow}`
                    : "",
                ...style,
            }}
            onMouseMove={(e) => {
                if (htmlChecker.hasHover()) {
                    setHover(true);
                    htmlChecker.onLostHover(() => {
                        setHover(false);
                    });
                }
            }}
            onMouseDown={(e) => {
                setActive(true);
            }}
            onMouseUp={(e) => {
                if (active && !props.disabled) {
                    props.onClick && props.onClick();
                }
                setActive(false);
            }}
            onMouseLeave={(e) => {
                setActive(false);
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: props.value && props.icon ? size / 2 : 0,
                }}
            >
                {props.icon}
            </div>
            <span>{props.value}</span>
        </div>
    );
};

Button.defaultProps = {
    size: "medium",
    fontWeight: "normal",
    value: "",
    disabled: false,
    round: false,
    selected: false,
    border: true,
    expand: false,
};

export default Button;
