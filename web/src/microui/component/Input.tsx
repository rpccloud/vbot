import React, { ChangeEvent, CSSProperties, useContext } from "react";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import {
    ComponentColor,
    extendConfig,
    getFontSize,
    makeTransition,
    Size,
    Transition,
} from "../util";
import { ActionSonar } from "../sonar/action";
import { TempValueSonar } from "../sonar/tempValue";
import { ResizeSonar } from "../sonar/resize";
import { extendTheme, Theme, ThemeCache, ThemeContext } from "../context/theme";
import { FocusContext } from "../context/focus";
import { Button } from "./Button";
import { Spin } from "./Spin";

let themeCache = new ThemeCache((theme) => ({
    ...defaultConfig,
    primary: {
        font: theme.primary?.contrastText,
        background: "transparent",
        border: theme.primary?.main,
        shadow: "transparent",
    },
    hover: {
        font: theme.hover?.contrastText,
        background: "transparent",
        border: theme.hover?.main,
        shadow: "transparent",
    },
    highlight: {
        font: theme.highlight?.contrastText,
        border: theme.highlight?.main,
        background: "transparent",
        shadow: theme.highlight?.main,
    },
    focus: {
        border: theme.focus?.main,
    },
    successful: {
        font: theme.successful?.contrastText,
        background: theme.successful?.main,
        border: theme.successful?.main,
        shadow: "transparent",
    },
    failed: {
        font: theme.failed?.contrastText,
        background: theme.failed?.main,
        border: theme.failed?.main,
        shadow: "transparent",
    },
    placeholderColor: theme.disabled?.contrastText,
    validateErrorColor: theme.failed?.main,
    transition: theme.transition,
}));

const defaultConfig = {
    revertIcon: <AiOutlineClose />,
    submitIcon: <AiOutlineCheck />,
    editIcon: <AiOutlineLock />,
    passwordShowIcon: <AiOutlineEye />,
    passwordHiddenIcon: <AiOutlineEyeInvisible />,
};

export interface InputConfig {
    revertIcon?: React.ReactElement;
    submitIcon?: React.ReactElement;
    editIcon?: React.ReactElement;
    passwordShowIcon?: React.ReactElement;
    passwordHiddenIcon?: React.ReactElement;
    primary?: ComponentColor;
    hover?: ComponentColor;
    highlight?: ComponentColor;
    focus?: ComponentColor;
    successful?: ComponentColor;
    failed?: ComponentColor;
    placeholderColor?: string;
    validateErrorColor?: string;
    transition?: Transition;
}

interface InputProps {
    type: "password" | "text";
    outline: "bare" | "underline" | "border";
    size: Size;
    theme?: Theme;
    config: InputConfig;
    icon?: React.ReactNode;
    label: string;
    defaultValue: string;
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
    reportStatus: "successful" | "failed" | "none";
}

const InputButton = (props: {
    size: Size;
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
    static contextType = ThemeContext;
    static defaultProps = {
        type: "text",
        outline: "border",
        size: "medium",
        fontWeight: "normal",
        config: {},
        label: "",
        defaultValue: "",
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

    private rootRef = React.createRef<HTMLDivElement>();
    private inputRef = React.createRef<HTMLInputElement>();
    private actionSonar = new ActionSonar([this.rootRef]);
    private tempValueSonar = new TempValueSonar(1000, "none", (status) => {
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
        this.actionSonar.close();
        this.tempValueSonar.close();
    }

    render() {
        const config: InputConfig = extendConfig(
            themeCache.getConfig(extendTheme(this.context, this.props.theme)),
            this.props.config
        );

        let color = config.primary;

        if (this.state.hover) {
            color = config.hover;
        }

        if (this.state.focus) {
            color = { ...config.highlight, ...config.focus };
        }

        if (this.state.reportStatus === "failed") {
            color = config.failed;
        }

        if (this.state.reportStatus === "successful") {
            color = config.successful;
        }

        const fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);
        let qrHeight = Math.round(height / 4);
        let innerMargin =
            this.props.innerMargin !== undefined
                ? this.props.innerMargin
                : qrHeight;
        let innerLeft =
            this.props.innerLeft !== undefined
                ? this.props.innerLeft
                : this.props.outline === "border"
                ? qrHeight
                : 0;
        let innerRight =
            this.props.innerRight !== undefined
                ? this.props.innerRight
                : this.props.outline === "border"
                ? qrHeight
                : 0;

        const isShowPassword =
            this.props.type === "password" && this.state.showPassword;

        let canFocus = this.props.focusable && !this.state.submitting;

        const underlineView =
            this.props.outline === "underline" ? (
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
                        height: 1,
                        background: color?.border,
                        boxShadow: `0px 0px ${qrHeight / 2}px ${color?.shadow}`,
                        transition: "inherit",
                    }}
                />
            ) : null;

        const iconView = this.props.icon ? (
            <div
                style={{
                    display: "flex",
                    height: fontSize,
                    width: fontSize,
                    alignItems: "center",
                    justifyContent: "center",
                    color: !this.props.validator(this.state.value)
                        ? config.validateErrorColor
                        : color?.font,
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
                        ? config.validateErrorColor
                        : color?.font,
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
                    minWidth: fontSize,
                    border: 0,
                    padding: 0,
                    flex: 1,
                    cursor: this.state.focus ? "text" : "inherit",
                    caretColor: this.state.focus ? color?.font : "transparent",
                    background: "transparent",
                    color: this.state.value
                        ? color?.font
                        : config.placeholderColor,
                    fontWeight: "inherit",
                    transition: makeTransition(
                        ["background"],
                        config.transition?.duration,
                        config.transition?.easing
                    ),
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
                        this.inputRef.current?.setSelectionRange(
                            this.state.value.length,
                            this.state.value.length
                        );
                        const resizeSonar = new ResizeSonar(
                            this.inputRef,
                            () => {
                                if (this.props.submittable) {
                                    const elem = this.inputRef.current;
                                    if (elem) {
                                        elem.scrollLeft = elem.scrollWidth;
                                    }
                                }
                                resizeSonar.close();
                            }
                        );

                        this.actionSonar.checkFocus(
                            () => {
                                this.setState({ focus: true });
                            },
                            () => {
                                resizeSonar.close();
                                this.setState({ focus: false });
                                if (
                                    !this.state.submitting &&
                                    this.props.submittable &&
                                    this.state.value !== this.state.stageValue
                                ) {
                                    this.setState({
                                        value: this.state.stageValue,
                                    });
                                    this.tempValueSonar.setValue("failed");
                                }
                            }
                        );
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
                            ? config.passwordShowIcon
                            : config.passwordHiddenIcon
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
                    icon={config.revertIcon}
                    onClick={() => {
                        if (this.state.stageValue !== this.state.value) {
                            this.setState({ value: this.state.stageValue });
                        }
                        this.inputRef.current?.blur();
                    }}
                />
            ) : null;

        const submitProgressView = this.state.submitting ? (
            <Spin size={this.props.size} />
        ) : null;

        const submitButtonView =
            this.props.submittable &&
            !this.state.submitting &&
            this.state.focus ? (
                <InputButton
                    size={this.props.size}
                    marginLeft={innerMargin}
                    icon={config.submitIcon}
                    onClick={() => {
                        this.inputRef.current?.blur();
                        const currValue = this.state.value;
                        if (
                            !this.state.submitting &&
                            this.props.submittable &&
                            this.state.stageValue !== currValue
                        ) {
                            this.setState({ submitting: true });
                            let successful = false;
                            this.props
                                .onSubmit(this.state.stageValue, currValue)
                                .then((v) => {
                                    successful = v;
                                })
                                .catch(() => {
                                    successful = false;
                                })
                                .finally(() => {
                                    if (successful) {
                                        this.setState({
                                            stageValue: currValue,
                                        });
                                    } else {
                                        this.setState({
                                            value: this.state.stageValue,
                                        });
                                    }
                                    this.tempValueSonar.setValue(
                                        successful ? "successful" : "failed"
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
                    icon={config.editIcon}
                    onClick={() => {
                        this.inputRef.current?.focus();
                    }}
                />
            ) : null;

        let style = { ...this.props.style };

        if (this.props.outline === "border") {
            style = {
                border: `1px solid ${color?.border}`,
                boxShadow: `0px 0px ${qrHeight / 2}px ${color?.shadow}`,
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
                    fontSize: fontSize,
                    height: height,
                    color: color?.font,
                    cursor:
                        !this.props.submittable && canFocus && !this.state.focus
                            ? "pointer"
                            : "default",
                    backgroundColor: color?.background,
                    transition: makeTransition(
                        ["background", "color", "border", "box-shadow"],
                        config.transition?.duration,
                        config.transition?.easing
                    ),
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
                    this.actionSonar.checkHover(
                        () => {
                            this.setState({ hover: true });
                        },
                        () => {
                            this.setState({ hover: false });
                        }
                    );
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
                            height: fontSize,
                            width: innerLeft,
                        }}
                    />
                    {iconView}
                    {labelView}
                    {inputView}
                    {passwordButtonView}
                    {revertButtonView}
                    {submitButtonView}
                    {submitProgressView}
                    {editButtonView}
                    <div
                        style={{
                            height: fontSize,
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
