import React, { ChangeEvent, CSSProperties, useContext } from "react";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import { Button } from "./Button";

import {
    ColorSet,
    extendColorSet,
    FocusContext,
    getFontSize,
    getFontWeight,
    HtmlChecker,
    ITheme,
    ResizeSensor,
    Theme,
    ThemeCache,
    ThemeContext,
    TimerValue,
} from "..";

interface InputConfig {
    revertIcon?: React.ReactNode;
    submitIcon?: React.ReactNode;
    editIcon?: React.ReactNode;
    passwordShowIcon?: React.ReactNode;
    passwordHiddenIcon?: React.ReactNode;

    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
    success?: ColorSet;
    warning?: ColorSet;

    placeholderColor?: string;
    validateErrorColor?: string;
}

let themeCache = new ThemeCache();

const defaultConfig = {
    revertIcon: <AiOutlineClose />,
    submitIcon: <AiOutlineCheck />,
    editIcon: <AiOutlineLock />,
    passwordShowIcon: <AiOutlineEye />,
    passwordHiddenIcon: <AiOutlineEyeInvisible />,
};

function getConfig(theme: Theme): InputConfig {
    const themeKey = theme.hashKey();
    let record = themeCache.getConfig(themeKey);
    if (record) {
        return record;
    }

    record = {
        ...defaultConfig,
        normal: {
            font: theme.default.main.hsla,
            background: "transparent",
            border: theme.default.main.hsla,
            shadow: "transparent",
            auxiliary: theme.default.main.hsla,
        },
        hover: {
            font: theme.default.main.hsla,
            border: theme.primary.auxiliary.hsla,
            background: "transparent",
            shadow: "transparent",
            auxiliary: theme.default.main.hsla,
        },
        focus: {
            font: theme.default.main.hsla,
            border: theme.primary.auxiliary.lighten(5).hsla,
            background: "transparent",
            shadow: theme.primary.auxiliary.lighten(5).hsla,
            auxiliary: theme.default.main.hsla,
        },
        success: {
            font: theme.success.main.hsla,
            background: theme.success.auxiliary.hsla,
        },
        warning: {
            font: theme.warning.main.hsla,
            background: theme.warning.auxiliary.hsla,
        },
        placeholderColor: theme.default.main.alpha(0.4).hsla,
        validateErrorColor: theme.warning.auxiliary.hsla,
    };

    themeCache.setConfig(themeKey, record);
    return record;
}

interface InputProps {
    mode: "bare" | "underline" | "border";
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: ITheme;
    config: InputConfig;
    icon?: React.ReactNode;
    label: string;
    defaultValue: string;
    type: "password" | "text";
    placeholder: string;
    focusable: boolean;
    submittable: boolean;
    validator: (value: any) => boolean;
    innerLeft?: number;
    innerRight?: number;
    innerMargin?: number;
    style?: CSSProperties;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (oldValue: string, newValue: string) => Promise<boolean>;
}

interface InputState {
    hover: boolean;
    focus: boolean;
    showPassword: boolean;
    value: string;
    stageValue: string;
    submitting: boolean;
    reportStatus: "success" | "warning" | "none";
}

const InputButton = (props: {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    icon: React.ReactNode;
    marginLeft: number;
    onClick: () => void;
}) => {
    const fontSize = getFontSize(props.size);
    return (
        <>
            <Button
                round={true}
                ghost={true}
                border={false}
                focusable={false}
                size={props.size}
                icon={props.icon}
                style={{
                    width: fontSize,
                    height: fontSize,
                    marginLeft: props.marginLeft,
                }}
                onClick={() => {
                    props.onClick();
                }}
            />
        </>
    );
};

class InputCore extends React.Component<InputProps, InputState> {
    static defaultProps = {
        mode: "border",
        size: "medium",
        fontWeight: "normal",
        config: {},
        label: "",
        defaultValue: "",
        type: "text",
        placeholder: "",
        focusable: true,
        submittable: false,
        validator: () => true,
        onChange: () => void {},
        onSubmit: () => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        },
    };

    static contextType = ThemeContext;
    private rootRef = React.createRef<HTMLDivElement>();
    private inputRef = React.createRef<HTMLInputElement>();
    private htmlChecker = new HtmlChecker(this.rootRef);
    private reportStatusTimerValue = new TimerValue(1000, "none", (status) => {
        this.setState({ reportStatus: status });
    });

    constructor(props: InputProps) {
        super(props);
        this.state = {
            hover: false,
            focus: false,
            showPassword: false,
            value: props.defaultValue,
            stageValue: props.defaultValue,
            submitting: false,
            reportStatus: "none",
        };
    }

    componentWillUnmount() {
        this.htmlChecker.depose();
        this.reportStatusTimerValue.depose();
    }

    render() {
        const size = getFontSize(this.props.size);
        const fontWeight = getFontWeight(this.props.fontWeight);
        const cfg: InputConfig = getConfig(
            this.context.extend(this.props.theme)
        );
        const propCfg = this.props.config;
        let color = extendColorSet(cfg.normal, propCfg.normal);

        if (this.state.hover) {
            color = extendColorSet(cfg.hover, propCfg.hover);
        }

        if (this.state.focus) {
            color = extendColorSet(cfg.focus, propCfg.focus);
        }

        if (this.state.reportStatus === "warning") {
            color = extendColorSet(cfg.warning, propCfg.warning);
        }

        if (this.state.reportStatus === "success") {
            color = extendColorSet(cfg.success, propCfg.success);
        }

        const innerMargin =
            this.props.innerMargin !== undefined
                ? this.props.innerMargin
                : Math.floor(size / 3);
        const innerLeft =
            this.props.innerLeft !== undefined
                ? this.props.innerLeft
                : this.props.mode === "border"
                ? Math.floor(size / 2)
                : 0;
        const innerRight =
            this.props.innerRight !== undefined
                ? this.props.innerLeft
                : this.props.mode === "border"
                ? Math.floor(size / 2)
                : 0;

        const submitIcon = propCfg.submitIcon || cfg.submitIcon;
        const editIcon = propCfg.editIcon || cfg.editIcon;
        const revertIcon = propCfg.revertIcon || cfg.revertIcon;
        const passwordShowIcon =
            propCfg.passwordShowIcon || cfg.passwordShowIcon;
        const passwordHiddenIcon =
            propCfg.passwordHiddenIcon || cfg.passwordHiddenIcon;
        const placeholderColor =
            propCfg.placeholderColor || cfg.placeholderColor;
        const validateErrorColor =
            propCfg.validateErrorColor || cfg.validateErrorColor;

        const isShowPassword =
            this.props.type === "password" && this.state.showPassword;

        let canFocus = this.props.focusable && !this.state.submitting;

        const underlineView =
            this.props.mode === "underline" ? (
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
                        height: 1,
                        background: color.border,
                        boxShadow: `0px 0px ${size / 4}px ${color.shadow}`,
                        transition: "inherit",
                    }}
                />
            ) : null;

        const iconView = this.props.icon ? (
            <div
                style={{
                    display: "flex",
                    height: size,
                    width: size,
                    alignItems: "center",
                    justifyContent: "center",
                    color: !this.props.validator(this.state.value)
                        ? validateErrorColor
                        : color.auxiliary,
                    marginRight: innerMargin,
                    transition: "inherit",
                }}
            >
                {this.props.icon}
            </div>
        ) : null;

        const labelView = this.props.label ? (
            <div
                style={{
                    color: !this.props.validator(this.state.value)
                        ? validateErrorColor
                        : color.auxiliary,
                    marginRight: innerMargin,
                    transition: "inherit",
                }}
            >
                {this.props.label}
            </div>
        ) : null;

        const inputView = (
            <input
                ref={this.inputRef}
                tabIndex={-1}
                style={{
                    outline: "none",
                    minWidth: size,
                    border: 0,
                    padding: 0,
                    flex: 1,
                    cursor: this.state.focus ? "text" : "default",
                    caretColor: this.state.focus ? color.font : "transparent",
                    background: "transparent",
                    color: this.state.value ? color.font : placeholderColor,
                    fontWeight: "inherit",
                    transition: "background 350ms ease-out",
                }}
                placeholder={this.props.placeholder}
                type={isShowPassword ? "text" : this.props.type}
                value={this.state.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (this.state.focus) {
                        this.setState({ value: e.target.value });
                        this.props.onChange(e);
                    }
                }}
                onFocus={(e) => {
                    if (canFocus && !this.state.focus) {
                        this.setState({ focus: true });

                        this.inputRef.current?.setSelectionRange(
                            this.state.value.length,
                            this.state.value.length
                        );
                        const resizeSensor = new ResizeSensor(
                            this.inputRef,
                            () => {
                                const elem = this.inputRef.current;
                                if (elem) {
                                    elem.scrollLeft = elem.scrollWidth;
                                }
                            }
                        );

                        this.htmlChecker.onLostFocus(() => {
                            resizeSensor.close();
                            this.setState({ focus: false });
                            if (
                                !this.state.submitting &&
                                this.props.submittable &&
                                this.state.value !== this.state.stageValue
                            ) {
                                this.setState({
                                    value: this.state.stageValue,
                                });
                                this.reportStatusTimerValue?.setValue(
                                    "warning"
                                );
                            }
                        });
                    }
                }}
            />
        );

        const passwordButtonView =
            this.props.type === "password" ? (
                <InputButton
                    size={this.props.size}
                    marginLeft={innerMargin}
                    icon={
                        this.state.showPassword
                            ? passwordHiddenIcon
                            : passwordShowIcon
                    }
                    onClick={() => {
                        this.setState({
                            showPassword: !this.state.showPassword,
                        });
                    }}
                />
            ) : null;

        const revertButtonView =
            this.props.submittable &&
            !this.state.submitting &&
            this.state.focus ? (
                <InputButton
                    size={this.props.size}
                    marginLeft={innerMargin}
                    icon={revertIcon}
                    onClick={() => {
                        if (this.state.stageValue !== this.state.value) {
                            this.setState({ value: this.state.stageValue });
                        }
                        this.inputRef.current?.blur();
                    }}
                />
            ) : null;

        const submitButtonView =
            this.props.submittable &&
            !this.state.submitting &&
            this.state.focus ? (
                <InputButton
                    size={this.props.size}
                    marginLeft={innerMargin}
                    icon={submitIcon}
                    onClick={() => {
                        this.inputRef.current?.blur();
                        const currValue = this.state.value;
                        if (
                            !this.state.submitting &&
                            this.props.submittable &&
                            this.state.stageValue !== currValue
                        ) {
                            this.setState({ submitting: true });
                            let success = false;
                            this.props
                                .onSubmit(this.state.stageValue, currValue)
                                .then((v) => {
                                    success = v;
                                })
                                .catch(() => {
                                    success = false;
                                })
                                .finally(() => {
                                    if (success) {
                                        this.setState({
                                            stageValue: currValue,
                                        });
                                    } else {
                                        this.setState({
                                            value: this.state.stageValue,
                                        });
                                    }
                                    this.reportStatusTimerValue?.setValue(
                                        success ? "success" : "warning"
                                    );
                                    this.setState({ submitting: false });
                                });
                        }
                    }}
                />
            ) : null;

        const editButtonView =
            this.props.submittable && canFocus && !this.state.focus ? (
                <InputButton
                    size={this.props.size}
                    marginLeft={innerMargin}
                    icon={editIcon}
                    onClick={() => {
                        this.inputRef.current?.focus();
                    }}
                />
            ) : null;

        let style = { ...this.props.style };

        if (this.props.mode === "border") {
            style = {
                border: `1px solid ${color.border}`,
                boxShadow: `0px 0px ${size / 4}px ${color.shadow}`,
                ...style,
            };
        } else {
            style = {
                border: 0,
                ...style,
            };
        }

        return (
            <div
                ref={this.rootRef}
                tabIndex={canFocus ? 0 : -1}
                style={{
                    display: "block",
                    position: "relative",
                    overflow: "clip",
                    fontSize: size,
                    height: 2 * size,
                    fontWeight: fontWeight,
                    color: color.font,
                    backgroundColor: color.background,
                    transition: `background 250ms ease-out, color 250ms ease-out, border 250ms ease-out, box-shadow 250ms ease-out`,
                    ...style,
                }}
                onMouseDown={(e) => {
                    if (
                        canFocus &&
                        !this.state.focus &&
                        this.props.submittable
                    ) {
                        e.preventDefault();
                    }
                }}
                onMouseMove={(e) => {
                    if (!this.state.hover && this.htmlChecker) {
                        this.setState({ hover: true });
                        this.htmlChecker.onLostHover(() => {
                            this.setState({ hover: false });
                        });
                    }
                }}
                onFocus={() => {
                    this.inputRef.current?.focus();
                }}
            >
                <div
                    style={{
                        display: "flex",
                        position: "relative",
                        alignItems: "center",
                        flexFlow: "row",
                        width: "100%",
                        height: "100%",
                        transition: "inherit",
                    }}
                >
                    <div
                        style={{
                            height: size,
                            width: innerLeft,
                        }}
                    />
                    {iconView}
                    {labelView}
                    {inputView}
                    {passwordButtonView}
                    {revertButtonView}
                    {submitButtonView}
                    {editButtonView}
                    <div
                        style={{
                            height: size,
                            width: innerRight,
                        }}
                    />
                    {underlineView}
                </div>
            </div>
        );
    }
}

export const Input = (props: InputProps) => {
    const focusContext = useContext(FocusContext);
    return (
        <InputCore
            {...props}
            focusable={focusContext.focusable && props.focusable}
        />
    );
};

Input.defaultProps = InputCore.defaultProps;
