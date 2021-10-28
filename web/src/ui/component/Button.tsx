import React, { useContext, useRef, useState } from "react";
import ThemeConfig from "../theme/config";
import { HtmlChecker } from "../util/util";

interface ButtonProps {
    icon?: React.ReactElement;
    value: string;
    round: boolean;
    focus: boolean;
    border: boolean;
    bold: boolean;
    size: "small" | "medium" | "large";
    width?: number;
    padding: string;
    color: string;
    background: string;
    hoverColor?: string;
    hoverBackground?: string;
    clickColor?: string;
    clickBackground?: string;
    focusColor?: string;
    focusBackground?: string;
    onClick?: () => void;
}

const Button = (props: ButtonProps) => {
    const buttonElem = useRef<HTMLDivElement>(null);
    const theme = useContext(ThemeConfig);
    let [click, setClick] = useState(false);
    let [hover, setHover] = useState(false);
    const sizeMap = {
        small: theme.fontSizeSmall,
        medium: theme.fontSizeMedium,
        large: theme.fontSizeLarge,
    };

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

    return (
        <div
            ref={buttonElem}
            style={{
                display: "inline-flex",
                width: props.width || "auto",
                padding: props.padding,
                border: props.border ? "1px solid " + color : "",
                borderRadius: props.round ? 100 : 0,
                fontSize: sizeMap[props.size],
                flexFlow: "row",
                background: background,
                color: color,
                fontWeight: props.bold
                    ? theme.fontWeightBold
                    : theme.fontWeightNormal,
                transition: "background 300ms ease-out, color 300ms ease-out",
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
                if (click) {
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
                    marginRight: `6px`,
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
    round: false,
    border: true,
    bold: false,
    size: "medium",
    padding: "8px 8px 8px 8px",
    color: "rgb(0,0,0,0.8)",
    background: "rgb(0,0,0,0)",
    focus: false,
};

export default Button;
