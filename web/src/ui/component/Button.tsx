import React, { useContext, useRef, useState } from "react";
import ThemeConfig from "../theme/config";
import { HtmlChecker } from "../util/util";

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
    color: string;
    style?: any;
    background: string;
    hoverColor?: string;
    hoverBackground?: string;
    clickColor?: string;
    clickBackground?: string;
    focusColor?: string;
    focusBackground?: string;
    disabledColor?: string;
    disabledBackground?: string;
    onClick?: () => void;
}

const Button = (props: ButtonProps) => {
    const buttonElem = useRef<HTMLDivElement>(null);
    const theme = useContext(ThemeConfig);
    let [click, setClick] = useState(false);
    let [hover, setHover] = useState(false);
    let htmlChecker = new HtmlChecker(buttonElem);

    let color = props.color;
    let background = props.background;

    if (hover) {
        props.hoverColor && (color = props.hoverColor);
        props.hoverBackground && (background = props.hoverBackground);
    }

    if (click) {
        props.clickColor && (color = props.clickColor);
        props.hoverBackground && (background = props.hoverBackground);
    }

    if (props.focus) {
        props.focusColor && (color = props.focusColor);
        props.focusBackground && (background = props.focusBackground);
    }

    if (props.disabled) {
        props.disabledColor && (color = props.disabledColor);
        props.disabledBackground && (background = props.disabledBackground);
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
                borderColor: color,
                borderRadius: props.round ? 100 : 0,
                fontSize: props.fontSize,
                flexFlow: "row",
                background: background,
                color: color,
                fontWeight: props.bold
                    ? theme.fontWeightBold
                    : theme.fontWeightNormal,
                transition:
                    "background 200ms ease-out, color 300ms ease-out, border 200ms ease-out",
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
    color: "rgb(0,0,0,0.8)",
    background: "rgb(0,0,0,0)",
    focus: false,
};

export default Button;
