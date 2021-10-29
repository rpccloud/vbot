import React, { useContext, useRef, useState } from "react";
import { ThemeContext } from "../theme/config";
import { HtmlChecker } from "../util/util";

interface ButtonColor {
    font?: string;
    border?: string;
    background?: string;
}

interface ButtonContextProps {
    primaryColor?: ButtonColor;
    hoverColor?: ButtonColor;
    clickColor?: ButtonColor;
    focusColor?: ButtonColor;
    disabledColor?: ButtonColor;
}

export const ButtonContext = React.createContext<ButtonContextProps>({});

interface ButtonProps {
    icon?: React.ReactElement;
    value: string;
    disabled: boolean;
    round: boolean;
    focus: boolean;
    border: boolean;
    expand: boolean;
    bold: boolean;
    fontSize: string;
    radius: number;
    padding: string;
    style?: any;
    onClick?: () => void;
}

const Button = (props: ButtonProps) => {
    const buttonElem = useRef<HTMLDivElement>(null);
    const theme = useContext(ThemeContext);
    const config = useContext(ButtonContext);
    let [click, setClick] = useState(false);
    let [hover, setHover] = useState(false);
    let htmlChecker = new HtmlChecker(buttonElem);

    let defaultColor: ButtonColor = {
        font: theme.primaryColor,
        border: theme.primaryColor,
        background: "transparent",
    };

    let color: ButtonColor = { ...defaultColor, ...config.primaryColor };

    if (hover) {
        color = { ...color, ...config.hoverColor };
    }

    if (click) {
        color = { ...color, ...config.hoverColor };
    }

    if (props.focus) {
        color = { ...color, ...config.hoverColor };
    }

    if (props.disabled) {
        color = { ...defaultColor, ...config.hoverColor };
    }

    let style = {};
    if (props.round) {
        style = {
            ...props.style,
            width: 2 * props.radius,
            height: 2 * props.radius,
            alignItems: "center",
            justifyContent: "center",
        };
    }

    return (
        <div
            ref={buttonElem}
            style={{
                ...style,
                display: props.expand ? "flex" : "inline-flex",
                padding: props.round ? "" : props.padding,
                borderWidth: props.border ? 1 : 0,
                borderStyle: "solid",
                borderColor: color.border,
                borderRadius: props.round ? 100 : 0,
                fontSize: props.fontSize,
                flexFlow: "row",
                background: color.background,
                color: color.font,
                fontWeight: props.bold
                    ? theme.fontWeightBold
                    : theme.fontWeightNormal,
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out`,
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
                setClick(true);
            }}
            onMouseUp={(e) => {
                if (click && !props.disabled) {
                    props.onClick && props.onClick();
                }
                setClick(false);
            }}
            onMouseLeave={(e) => {
                setClick(false);
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: props.value && props.icon ? 6 : 0,
                }}
            >
                {props.icon}
            </div>
            <span>{props.value}</span>
        </div>
    );
};

Button.defaultProps = {
    value: "",
    disabled: false,
    round: false,
    border: true,
    bold: false,
    expand: false,
    fontSize: 16,
    radius: 16,
    padding: "8px 8px 8px 8px",
    focus: false,
};

export default Button;
