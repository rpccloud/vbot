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
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import Button from "./Button";

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
        revertIcon: <AiOutlineClose />,
        editIconActive: <AiOutlineCheck />,
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

    revertIcon?: React.ReactNode;
    editIconActive?: React.ReactNode;
    editIconInactive?: React.ReactNode;
    passwordIconActive?: React.ReactNode;
    passwordIconInactive?: React.ReactNode;
}

export const InputContext = React.createContext<IInputContextProps>({});

interface InputProps {
    embed: boolean;
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
    onChange: (value: string) => void;
    onSubmit: (oldValue: string, newValue: string) => void;
}

const Input = (props: InputProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useContext(ThemeContext);
    const inputConfig = useContext(InputContext);
    const themeConfig = getConfig(theme);
    let [focus, setFocus] = useState(false);
    let [hover, setHover] = useState(false);
    let [type, setType] = useState(props.type);
    let [value, setValue] = useState(props.value);

    let htmlChecker = new HtmlChecker(rootRef);
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
    const revertIcon = inputConfig.revertIcon || themeConfig.revertIcon;

    const spacer = (
        <div
            style={{
                display: "block",
                width: !props.embed || focus ? size / 2 : 0,
                transition: "width 250ms ease-out",
            }}
        />
    );

    const underlineView =
        props.embed && !focus ? (
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    height: 1,
                    background: color.border,
                    transition: "background 250ms ease-out",
                }}
            />
        ) : null;

    const prefixIconView = props.prefixIcon ? (
        <div
            style={{
                height: size,
                color:
                    props.validator && !props.validator(value)
                        ? warningColor?.hsla
                        : "inherit",
                marginRight: size / 3,
                transition: "color 300ms ease-out",
            }}
        >
            {props.prefixIcon}
        </div>
    ) : null;

    const labelView = props.label ? (
        <div
            style={{
                height: size,
                marginRight: size / 3,
            }}
        >
            {props.label}
        </div>
    ) : null;

    const inputView = (
        <input
            ref={inputRef}
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
                caretColor: focus ? color.font : "transparent",
            }}
            placeholder={props.placeholder}
            type={type}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                props.onChange(e.target.value);
            }}
            onMouseDown={(e) => {
                if (props.embed && !focus) {
                    e.preventDefault();
                }
            }}
            onFocus={(e) => {
                setFocus(true);
                htmlChecker.onLostFocus(() => {
                    setFocus(false);
                });
            }}
        />
    );

    const passwordButtonView =
        props.type === "password" ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={
                    type === "password"
                        ? passwordIconInactive
                        : passwordIconActive
                }
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                onClick={() => {
                    setType(type === "password" ? "text" : "password");
                }}
            />
        ) : null;

    const revertButtonView =
        props.embed && focus ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={revertIcon}
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                onClick={() => {
                    setFocus(false);
                    inputRef.current?.blur();
                    // if (edit) {
                    //     setEdit(false);
                    //     inputRef.current?.blur();
                    //     props.onEdit && props.onEdit(value);
                    // } else {
                    //     setEdit(true);
                    //     inputRef.current?.focus();
                    // }
                }}
            />
        ) : null;

    const submitButtonView =
        props.embed && focus ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={editIconActive}
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                clickType="mouseup"
                onClick={() => {
                    setFocus(false);
                    inputRef.current?.blur();
                }}
            />
        ) : null;

    const editButtonView =
        props.embed && !focus ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={editIconInactive}
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                onClick={() => {
                    setFocus(true);
                    inputRef.current?.focus();
                }}
            />
        ) : null;

    return (
        <div
            ref={rootRef}
            tabIndex={0}
            style={{
                display: "flex",
                position: "relative",
                flexFlow: "row",
                lineHeight: `${size}px`,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor:
                    props.embed && !focus ? "transparent" : color.border,
                boxShadow: `0px 0px ${size / 5}px ${color.shadow}`,
                overflow: "clip",
                fontSize: size,
                color: color.font,
                padding: `${size / 2}px 0px ${size / 2}px 0px`,
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
            }}
            onMouseMove={(e) => {
                setHover(true);
                htmlChecker.onLostHover(() => {
                    setHover(false);
                });
            }}
            onFocus={() => {
                inputRef.current?.focus();
            }}
        >
            {spacer}
            {prefixIconView}
            {labelView}
            {inputView}
            {passwordButtonView}
            {revertButtonView}
            {submitButtonView}
            {editButtonView}
            {spacer}
            {underlineView}
        </div>
    );
};

Input.defaultProps = {
    embed: false,
    disabled: false,
    underline: false,
    type: "text",
    size: "medium",
    fontWeight: "normal",
    value: "",
    placeholder: "",
    label: "",
    initEdit: true,
    onChange: (value: string) => void {},
    onSubmit: (oldValue: string, newValue: string) => void {},
};

export default Input;
