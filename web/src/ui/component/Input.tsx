import React, { CSSProperties, useContext, useRef, useState } from "react";
import {
    Color,
    getFontSize,
    getFontWeight,
    IColorUnit,
    ThemeConfig,
    ThemeContext,
} from "../theme/config";
import { HtmlChecker, TimerValue } from "../util/util";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import Button from "./Button";

interface IInputContextProps {
    revertIcon?: React.ReactNode;
    submitIcon?: React.ReactNode;
    editIcon?: React.ReactNode;
    passwordIconActive?: React.ReactNode;
    passwordIconInactive?: React.ReactNode;

    normal?: IColorUnit;
    hover?: IColorUnit;
    focus?: IColorUnit;
    successColor?: Color;
    warningColor?: Color;
    placeholderColor?: Color;
}

export const InputContext = React.createContext<IInputContextProps>({});

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
        submitIcon: <AiOutlineCheck />,
        editIcon: <AiOutlineLock />,
        passwordIconActive: <AiOutlineEye />,
        passwordIconInactive: <AiOutlineEyeInvisible />,
        normal: {
            font: theme.foregroundColor.hsla,
            border: theme.foregroundColor.hsla,
            background: "transparent",
            shadow: "transparent",
            auxiliary: theme.foregroundColor.alpha(0.4).hsla,
        },
        hover: {
            font: theme.foregroundColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: "transparent",
            auxiliary: theme.primaryColor.alpha(0.7).hsla,
        },
        focus: {
            font: theme.foregroundColor.hsla,
            border: theme.primaryColor.hsla,
            background: "transparent",
            shadow: theme.primaryColor.hsla,
            auxiliary: theme.primaryColor.hsla,
        },
        successColor: theme.successColor,
        warningColor: theme.warningColor,
        placeholderColor: theme.foregroundColor.alpha(0.4),
    };

    themeCache.key = themeKey;
    themeCache.config = config;

    return config;
}

interface InputProps {
    mode: "bare" | "underline" | "border";
    editable: boolean;
    submittable: boolean;
    type: "password" | "text";
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    prefixIcon?: React.ReactNode;
    label: string;
    defaultValue: string;
    placeholder: string;
    validator: (value: any) => boolean;
    style?: CSSProperties;
    onChange: (value: string) => void;
    onSubmit?: (oldValue: string, newValue: string) => Promise<boolean>;
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
    let [currentValue, setCurrentValue] = useState(props.defaultValue);
    let [stageValue, setStageValue] = useState(props.defaultValue);
    let [loading, setLoading] = useState(false);
    let [inputBG, setInputBG] = useState("transparent");
    let [inputBGTimerValue] = useState(
        new TimerValue(1000, "transparent", (bg) => {
            setInputBG(bg);
        })
    );
    let [htmlChecker] = useState(new HtmlChecker(rootRef));

    // let inputBGTimerValue =
    let fontSize = getFontSize(props.size);
    let size = fontSize + 2;
    let color = { ...themeConfig.normal, ...inputConfig.normal };

    if (hover) {
        color = { ...themeConfig.hover, ...inputConfig.hover };
    }

    if (focus) {
        color = { ...themeConfig.focus, ...inputConfig.focus };
    }

    const successColor = inputConfig.successColor || themeConfig.successColor;
    const warningColor = inputConfig.warningColor || themeConfig.warningColor;
    const placeholderColor =
        inputConfig.placeholderColor || themeConfig.placeholderColor;

    const passwordIconActive =
        inputConfig.passwordIconActive || themeConfig.passwordIconActive;
    const passwordIconInactive =
        inputConfig.passwordIconInactive || themeConfig.passwordIconInactive;
    const submitIcon = inputConfig.submitIcon || themeConfig.submitIcon;
    const editIcon = inputConfig.editIcon || themeConfig.editIcon;
    const revertIcon = inputConfig.revertIcon || themeConfig.revertIcon;

    const underlineView =
        props.mode === "underline" ? (
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    height: 1,
                    background: color.auxiliary,
                    boxShadow: `0px 0px ${size / 4}px ${color.shadow}`,
                    transition: "inherit",
                }}
            />
        ) : null;

    const prefixIconView = props.prefixIcon ? (
        <div
            style={{
                display: "flex",
                height: size,
                width: size,
                alignItems: "center",
                justifyContent: "center",
                color: !props.validator(currentValue)
                    ? warningColor?.hsla
                    : "inherit",
                marginRight: size / 3,
                transition: "inherit",
            }}
        >
            {props.prefixIcon}
        </div>
    ) : null;

    const labelView = props.label ? (
        <div
            style={{
                height: size,
                color: !props.validator(currentValue)
                    ? warningColor?.hsla
                    : "inherit",
                marginRight: size / 3,
                transition: "inherit",
            }}
        >
            {props.label} {currentValue}
        </div>
    ) : null;

    const inputView = (
        <input
            ref={inputRef}
            tabIndex={props.editable ? 0 : -1}
            style={{
                display: "block",
                outline: "none",
                border: "0px",
                padding: "0px",
                width: "100%",
                lineHeight: `${size}px`,
                height: size,
                cursor: focus ? "text" : "default",
                background: inputBG,
                color: currentValue ? color.font : placeholderColor?.hsla,
                fontWeight: getFontWeight(props.fontWeight),
                caretColor: focus ? color.font : "transparent",
                transition: "background 350ms ease-out",
            }}
            placeholder={props.placeholder}
            type={type}
            value={currentValue}
            onChange={(e) => {
                if (e.target.value !== currentValue) {
                    setCurrentValue(e.target.value);
                    props.onChange(e.target.value);
                }
            }}
            onFocus={(e) => {
                if (!focus) {
                    setFocus(true);
                    setStageValue(currentValue);
                    if (inputRef.current) {
                        inputRef.current.setSelectionRange(
                            currentValue.length,
                            currentValue.length
                        );
                    }
                    htmlChecker.onLostFocus(() => {
                        setFocus(false);
                        console.log(`log current ${currentValue}`);
                        if (currentValue !== stageValue) {
                            console.log("NO2");
                            setCurrentValue(stageValue);
                            inputBGTimerValue.setValue(warningColor?.hsla);
                        }
                    });
                }
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
        props.editable && props.submittable && focus ? (
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
                    inputRef.current?.blur();
                }}
            />
        ) : null;

    const submitButtonView =
        props.editable && props.submittable && focus ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={submitIcon}
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                onClick={() => {
                    inputRef.current?.blur();

                    if (
                        props.onSubmit &&
                        !loading &&
                        stageValue !== currentValue
                    ) {
                        let success = false;
                        setLoading(true);
                        props
                            .onSubmit(stageValue, currentValue)
                            .then((v) => {
                                success = v;
                            })
                            .catch(() => {
                                success = false;
                            })
                            .finally(() => {
                                if (success) {
                                    setStageValue(currentValue);
                                } else {
                                    setCurrentValue(stageValue);
                                }
                                inputBGTimerValue.setValue(
                                    success
                                        ? successColor?.hsla
                                        : warningColor?.hsla
                                );
                                setLoading(false);
                            });
                    }
                }}
            />
        ) : null;

    const editButtonView =
        props.editable && props.submittable && !focus ? (
            <Button
                round={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={editIcon}
                style={{
                    width: size,
                    height: size,
                    marginLeft: size / 3,
                }}
                onClick={() => {
                    inputRef.current?.focus();
                }}
            />
        ) : null;

    let style = { ...props.style };

    if (props.mode === "border") {
        style = {
            border: `1px solid ${color.border}`,
            boxShadow: `0px 0px ${size / 4}px ${color.shadow}`,
            ...style,
        };
    } else {
        style = {
            border: "1px solid transparent",
            ...style,
        };
    }

    return (
        <div
            ref={rootRef}
            tabIndex={props.editable ? 0 : -1}
            style={{
                display: "flex",
                position: "relative",
                flexFlow: "row",
                lineHeight: `${size}px`,
                overflow: "clip",
                fontSize: fontSize,
                color: color.font,
                padding:
                    props.mode === "border"
                        ? `${size / 2}px`
                        : `${size / 2}px 0px ${size / 2}px 0px`,
                transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                ...style,
            }}
            onMouseDown={(e) => {
                if ((props.submittable && !focus) || !props.editable) {
                    e.preventDefault();
                }
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
            {prefixIconView}
            {labelView}
            {inputView}
            {passwordButtonView}
            {revertButtonView}
            {submitButtonView}
            {editButtonView}
            {underlineView}
        </div>
    );
};

Input.defaultProps = {
    mode: "border",
    editable: true,
    submittable: false,
    type: "text",
    size: "medium",
    fontWeight: "normal",
    label: "",
    defaultValue: "",
    placeholder: "",
    validator: () => true,
    onChange: () => void {},
};

export default Input;
