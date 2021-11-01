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
            font: theme.primaryColor.alpha(0.7).hsla,
            border: theme.primaryColor.alpha(0.7).hsla,
            background: "transparent",
            shadow: "transparent",
        },
        hover: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        active: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
            shadow: theme.primaryColor.hsla,
            background: "transparent",
        },
        focus: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        selected: {
            font: theme.primaryColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        disabled: {
            font: theme.disabledColor.hsla,
            border: theme.disabledColor.hsla,
            background: "transparent",
            shadow: "transparent",
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

const Button = (props: ButtonProps) => {
    const buttonElem = useRef<HTMLButtonElement>(null);
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
            width: 2 * size,
            height: 2 * size,
            padding: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: size,
            ...props.style,
        };
    } else {
        style = {
            padding: `${size / 2}px ${size / 2}px ${size / 2}px ${size / 2}px`,
            ...props.style,
        };
    }

    return (
        <button
            tabIndex={props.focusable ? 0 : -1}
            ref={buttonElem}
            style={{
                display: "inline-flex",
                borderWidth: props.border ? 1 : 0,
                borderStyle: "solid",
                borderColor: color.border,
                fontSize: size,
                flexFlow: "row",
                backgroundColor: color.background,
                lineHeight: `${size}px`,
                color: color.font,
                fontWeight: getFontWeight(props.fontWeight),
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                boxShadow:
                    color.shadow && props.border
                        ? `0px 0px ${size / 4}px ${color.shadow}`
                        : "",
                ...style,
            }}
            onMouseMove={(e) => {
                setHover(true);
                htmlChecker.onLostHover(() => {
                    setHover(false);
                });
            }}
            onMouseDown={(e) => {
                setActive(true);
            }}
            onMouseUp={(e) => {
                setActive(false);
            }}
            onClick={() => {
                if (!props.disabled) {
                    props.onClick();
                }
            }}
            onMouseLeave={(e) => {
                setActive(false);
            }}
        >
            {props.icon}
            <span style={{ width: props.value && props.icon ? size / 3 : 0 }} />
            {props.value}
        </button>
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
    focusable: true,
    onClick: () => void {},
};

export default Button;
