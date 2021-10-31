import React, { CSSProperties, useContext, useRef, useState } from "react";
import {
    Color,
    getFontSize,
    getFontWeight,
    IColorUnit,
    ThemeConfig,
    ThemeContext,
} from "../theme/config";
import { HtmlChecker } from "../util/util";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineUnlock } from "@react-icons/all-files/ai/AiOutlineUnlock";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

let themeCache: { key: string; config: IInputContextProps } = {
    key: "",
    config: {},
};

function getConfig(theme: ThemeConfig): IInputContextProps {
    const themeKey = theme.hashKey();

    if (themeCache.key === themeKey) {
        return themeCache.config;
    }

    let config = {
        editIconActive: <AiOutlineUnlock />,
        editIconInactive: <AiOutlineLock />,
        passwordIconActive: <AiOutlineEye />,
        passwordIconInactive: <AiOutlineEyeInvisible />,
        normal: {
            font: theme.foregroundColor.hsla,
            border: theme.foregroundColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        hover: {
            font: theme.foregroundColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        focus: {
            font: theme.foregroundColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: theme.primaryColor.hsla,
        },
        disabled: {
            font: theme.disabledColor.hsla,
            border: theme.disabledColor.hsla,
            background: "transparent",
            shadow: "transparent",
        },
        successColor: theme.successColor,
        warningColor: theme.warningColor,
    };

    themeCache.key = themeKey;
    themeCache.config = config;

    return config;
}

interface IInputContextProps {
    normal?: IColorUnit;
    hover?: IColorUnit;
    focus?: IColorUnit;
    disabled?: IColorUnit;
    successColor?: Color;
    warningColor?: Color;

    editIconActive?: React.ReactNode;
    editIconInactive?: React.ReactNode;
    passwordIconActive?: React.ReactNode;
    passwordIconInactive?: React.ReactNode;
}

export const InputContext = React.createContext<IInputContextProps>({});

interface InputProps {
    initEdit: boolean;
    disabled: boolean;
    underline: boolean;
    type: "password" | "text";
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    value: string;
    placeholder: string;
    label: string;
    validator?: (value: any) => boolean;
    prefixIcon?: React.ReactNode;
    style?: CSSProperties;
    onChange?: (e: { target: { value: any } }) => void;
    onSubmit?: (value: any) => void;
}

const Input = (props: InputProps) => {
    const inputEl = useRef<HTMLInputElement>(null);
    const theme = useContext(ThemeContext);
    const inputConfig = useContext(InputContext);
    const themeConfig = getConfig(theme);
    let [focus, setFocus] = useState(false);
    let [hover, setHover] = useState(false);
    let [type, setType] = useState(props.type);
    let [edit, setEdit] = useState(props.initEdit);
    let [value, setValue] = useState(props.value);

    let htmlChecker = new HtmlChecker(inputEl);
    let fakePassword = "000000";

    let size = getFontSize(props.size);
    let color = { ...themeConfig.normal, ...inputConfig.normal };

    if (hover) {
        color = { ...themeConfig.hover, ...inputConfig.hover };
    }

    if (focus) {
        color = { ...themeConfig.focus, ...inputConfig.focus };
    }

    if (props.disabled) {
        color = { ...themeConfig.disabled, ...inputConfig.disabled };
    }

    // const successColor = inputConfig.successColor || themeConfig.successColor;
    const warningColor = inputConfig.warningColor || themeConfig.warningColor;

    const passwordIconActive =
        inputConfig.passwordIconActive || themeConfig.passwordIconActive;
    const passwordIconInactive =
        inputConfig.passwordIconInactive || themeConfig.passwordIconInactive;
    const editIconActive =
        inputConfig.editIconActive || themeConfig.editIconActive;
    const editIconInactive =
        inputConfig.editIconInactive || themeConfig.editIconInactive;

    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                flexFlow: "row",
                lineHeight: `${size}px`,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: edit ? color.border : "transparent",
                boxShadow: `0px 0px ${size / 4}px ${color.shadow}`,
                overflow: "clip",
                fontSize: size,
                color: color.font,
                padding: `${size / 2}px 0px ${size / 2}px 0px`,
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
            }}
            onMouseDown={(e) => {
                if ((e.eventPhase === 2 || e.eventPhase === 3) && edit) {
                    inputEl.current && inputEl.current.focus();
                }
            }}
            onMouseMove={(e) => {
                if (htmlChecker.hasHover()) {
                    setHover(true);
                    htmlChecker.onLostHover(() => {
                        setHover(false);
                    });
                }
            }}
        >
            <div
                style={{
                    display: !edit && props.underline ? "block" : "none",
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    height: 1,
                    background: color.border,
                    transition: "background 250ms ease-out",
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            />

            <div
                style={{ display: edit ? "block" : "none", width: size / 2 }}
            />

            <div
                style={{
                    display: props.prefixIcon ? "block" : "none",
                    marginRight: size / 3,
                    height: size,
                    color:
                        props.validator && !props.validator(value)
                            ? warningColor?.hsla
                            : "inherit",
                    transition: "color 300ms ease-out",
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            >
                {props.prefixIcon}
            </div>

            <div
                style={{
                    display: props.label ? "block" : "none",
                    marginRight: size / 3,
                    height: size,
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            >
                {props.label}
            </div>

            <input
                ref={inputEl}
                style={{
                    display: "block",
                    outline: "none",
                    border: "0px",
                    padding: "0px",
                    width: "100%",
                    lineHeight: `${size}px`,
                    height: size,
                    background: "transparent",
                    color: color.font,
                    fontWeight: getFontWeight(props.fontWeight),
                    caretColor: edit ? color.font : "transparent",
                }}
                placeholder={edit ? props.placeholder : ""}
                type={type}
                value={!edit && type === "password" ? fakePassword : value}
                onMouseDown={(e) => {
                    if (!edit) {
                        e.preventDefault();
                    }
                }}
                onFocus={(e) => {
                    setFocus(true);
                    htmlChecker.onLostFocus(() => {
                        setFocus(false);
                    });
                }}
                onChange={(e) => {
                    if (edit) {
                        setValue(e.target.value);
                        props.onChange && props.onChange(e);
                    } else {
                        e.preventDefault();
                    }
                }}
            />

            <div
                style={{
                    alignItems: "center",
                    height: size,
                    display:
                        (edit && props.type) === "password" ? "block" : "none",
                    marginLeft: size / 3,
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    setType(type === "password" ? "text" : "password");
                }}
            >
                {type === "password"
                    ? passwordIconInactive
                    : passwordIconActive}
            </div>

            <div
                style={{
                    alignItems: "center",
                    height: size,
                    display: props.onSubmit ? "block" : "none",
                    marginLeft: size / 3,
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    if (edit) {
                        e.stopPropagation();
                        setEdit(false);
                        inputEl.current && inputEl.current.blur();
                        props.onSubmit && props.onSubmit(value);
                    } else {
                        setEdit(true);
                        inputEl.current && inputEl.current.focus();
                    }
                }}
            >
                {edit ? editIconActive : editIconInactive}
            </div>

            <div
                style={{ display: edit ? "inline" : "none", width: size / 2 }}
            />
        </div>
    );
};

Input.defaultProps = {
    disabled: false,
    underline: false,
    type: "text",
    size: "medium",
    fontWeight: "normal",
    value: "",
    placeholder: "",
    label: "",
    initEdit: true,
};

export default Input;
