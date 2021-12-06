import React from "react";
import {
    extendConfig,
    getFontSize,
    getStateValue,
    makeTransition,
    Size,
    UiCSSProperties,
    UIState,
    UIStateConfig,
    withDefault,
} from "..";
import { Theme, ThemeContext } from "../theme";
import { ActionSonar } from "../utils/action-sonar";
import { ShortLivedValue } from "../utils/short-lived-value";
import { ButtonConfig } from "./Button";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

const defaultConfig = {
    revertIcon: <AiOutlineClose />,
    submitIcon: <AiOutlineCheck />,
    editIcon: <AiOutlineLock />,
    passwordShowIcon: <AiOutlineEye />,
    passwordHiddenIcon: <AiOutlineEyeInvisible />,
};

export interface InputConfig {
    icon?: UIStateConfig;
    label?: UIStateConfig;
    input?: UIStateConfig;
    border?: UIStateConfig;
    shadow?: UIStateConfig;
    passwordShowButton?: ButtonConfig;
    passwordHiddenButton?: ButtonConfig;
    revertButton?: ButtonConfig;
    submitButton?: ButtonConfig;
    editButton?: ButtonConfig;
    loadingIcon?: UIStateConfig;
    successIcon?: UIStateConfig;
    errorIcon?: UIStateConfig;
}

type RenderFunc = (
    theme: Theme,
    config: InputConfig,
    actionState: UIState
) => React.ReactNode;

interface InputProps {
    type: "password" | "text";
    outline: "bare" | "underline" | "rectangle";
    size?: Size;
    config?: InputConfig;
    icon?: React.ReactNode | RenderFunc;
    label: string | RenderFunc;
    labelWidth: "auto" | number;
    initialValue: string;
    placeholder: string;
    focusable: boolean;
    submittable: boolean;
    innerLeft?: number;
    innerMiddle?: number;
    innerRight?: number;
    shadowEffect: boolean;
    style?: UiCSSProperties;
    validator: (v: string) => boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (oldValue: string, newValue: string) => Promise<boolean>;
}

interface InputState {
    hover: boolean;
    active: boolean;
    focus: boolean;
    showPassword: boolean;
    value: string;
    stageValue: string;
    status: "submit" | "success" | "error" | "none";
}

export class Input extends React.Component<InputProps, InputState> {
    static contextType = ThemeContext;
    static defaultProps = {
        type: "text",
        outline: "border",
        label: "",
        labelWidth: "auto",
        initialValue: "",
        placeholder: "",
        focusable: true,
        submittable: false,
        shadowEffect: true,
        validator: () => true,
        onChange: () => void {},
        onSubmit: () => {
            return new Promise((resolve, _) => {
                resolve(true);
            });
        },
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private inputRef = React.createRef<HTMLInputElement>();
    private actionSonar?: ActionSonar;
    private shortLivedValue?: ShortLivedValue;

    constructor(props: InputProps) {
        super(props);
        this.state = {
            hover: false,
            active: false,
            focus: false,
            showPassword: false,
            value: props.initialValue,
            stageValue: props.initialValue,
            status: "none",
        };
    }

    componentDidMount() {
        this.actionSonar = new ActionSonar([this.rootRef]);
        this.shortLivedValue = new ShortLivedValue(1000, "none", (status) => {
            this.setState({ status: status });
        });
    }

    componentWillUnmount() {
        this.actionSonar?.close();
        this.actionSonar = undefined;

        this.shortLivedValue?.close();
        this.shortLivedValue = undefined;
    }

    private getConfig(theme: Theme, height: number): InputConfig {
        const palette = theme.palette;

        const sy = height / 20;
        const sr = height / 10;
        const sc = this.props.shadowEffect ? palette.shadow : "transparent";

        const assistConfig = {
            normal: palette.primary.main,
            hover: palette.hover.main,
            active: palette.active.main,
            disabled: palette.disabled.contrastText,
            success: palette.success.main,
            error: palette.error.main,
        };

        return {
            icon: assistConfig,
            label: assistConfig,
            input: {
                normal: palette.primary?.contrastText,
                hover: palette.hover?.contrastText,
                active: palette.active?.contrastText,
            },
            border: {
                normal: palette.outline,
                hover: palette.hover?.contrastText,
                active: palette.active?.contrastText,
            },
            shadow: {
                normal: `0px ${sy}px ${sr}px ${sc}`,
                hover: `0px ${sy}px ${sr * 2}px ${sc}`,
                active: `0px ${sy}px ${sr * 4}px ${sc}`,
            },
            loadingIcon: assistConfig,
            successIcon: assistConfig,
            errorIcon: assistConfig,
        };
    }

    private canFocus = (): boolean => {
        const theme: Theme = this.context;
        return (
            this.props.focusable &&
            theme.focus.focusable &&
            this.state.status !== "submit"
        );
    };

    private checkHover = () => {
        this.actionSonar?.checkHover(
            () => {
                this.setState({ hover: true });
            },
            () => {
                this.setState({ hover: false });
            }
        );
    };

    private checkFocus = () => {
        if (this.canFocus()) {
            this.actionSonar?.checkFocus(
                () => {
                    this.setState({ focus: true });
                },
                () => {
                    this.setState({ focus: false });
                }
            );
        }
    };

    private checkActive = () => {
        this.actionSonar?.checkActive(
            () => {
                this.setState({ active: true });
            },
            () => {
                this.setState({ active: false });
            }
        );
    };

    render() {
        const theme: Theme = this.context;
        const fontSize = getFontSize(withDefault(this.props.size, theme.size));
        const height = withDefault(
            this.props.style?.height,
            Math.round(fontSize * 2.3)
        );
        const config = extendConfig(
            this.getConfig(theme, height),
            this.props.config
        );

        const uiState = {
            isHover: this.state.hover,
            isActive: this.state.active,
            isSelected: false,
            isDisabled: this.state.status === "submit",
            isSuccess: this.state.status === "success",
            isError: this.state.status === "error",
        };

        const borderRadius = withDefault(
            this.props.style?.borderRadius,
            theme.borderRadius
        );

        const isShowPassword =
            this.props.type === "password" && this.state.showPassword;

        const middleMargin = (
            <div
                style={{
                    flex: "none",
                    width: withDefault(this.props.innerMiddle, height / 4),
                }}
            />
        );

        let componentList: Array<React.ReactNode> = [];

        // push left margin
        componentList.push(
            <div
                style={{
                    flex: "none",
                    width: withDefault(
                        this.props.innerLeft,
                        this.props.outline === "rectangle" ? height / 4 : 0
                    ),
                }}
            />
        );

        // push icon
        if (!!this.props.icon) {
            const view =
                typeof this.props.icon === "function" ? (
                    this.props.icon(theme, config, uiState)
                ) : (
                    <div
                        style={{
                            display: "flex",
                            height: fontSize,
                            width: fontSize,
                            alignItems: "center",
                            justifyContent: "center",
                            color: getStateValue(config.icon, uiState),
                            transition: "inherit",
                        }}
                    >
                        {this.props.icon}
                    </div>
                );
            componentList.push(view);
        }

        // push label
        if (!!this.props.label) {
            const view =
                typeof this.props.label === "function" ? (
                    this.props.label(theme, config, uiState)
                ) : (
                    <div
                        style={{
                            color: getStateValue(config.label, uiState),
                            transition: "inherit",
                            width: this.props.labelWidth,
                        }}
                    >
                        {this.props.label}
                    </div>
                );

            if (componentList.length > 1) {
                componentList.push(middleMargin);
            }

            componentList.push(view);
        }

        // push input
        if (componentList.length > 1) {
            componentList.push(middleMargin);
        }
        componentList.push(
            <form style={{ flex: 1, display: "flex", fontSize: "inherit" }}>
                <input
                    ref={this.inputRef}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{
                        flex: 1,
                        outline: "none",
                        fontSize: fontSize,
                        border: 0,
                        padding: 0,
                        cursor: this.state.focus ? "text" : "inherit",
                        caretColor: this.state.focus
                            ? getStateValue(config.input, uiState)
                            : "transparent",
                        background: "transparent",
                        color: this.state.value
                            ? getStateValue(config.input, uiState)
                            : config.placeholderColor,
                        fontWeight: "inherit",
                        transition: makeTransition(
                            ["background"],
                            config.transition?.durationMS + "ms",
                            config.transition?.easing
                        ),
                    }}
                    placeholder={this.props.placeholder}
                    type={isShowPassword ? "text" : this.props.type}
                    value={this.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (this.state.focus) {
                            this.setState({ value: e.target.value });
                            this.props.onChange(e);
                        }
                    }}
                    onFocus={(e) => {
                        if (this.canFocus() && !this.state.focus) {
                            const inputElem = this.inputRef.current;
                            if (inputElem) {
                                inputElem.setSelectionRange(
                                    this.state.value.length,
                                    this.state.value.length
                                );
                                inputElem.scrollLeft = inputElem.scrollWidth;
                            }

                            this.actionSonar?.checkFocus(
                                () => {
                                    this.setState({ focus: true });
                                },
                                () => {
                                    this.setState({ focus: false });
                                    if (
                                        this.state.status !== "submit" &&
                                        this.state.value !==
                                            this.state.stageValue
                                    ) {
                                        this.setState({
                                            value: this.state.stageValue,
                                        });
                                        this.shortLivedValue?.setValue("error");
                                    }
                                }
                            );
                        }
                    }}
                />
            </form>
        );

        // push right margin
        componentList.push(
            <div
                style={{
                    flex: "none",
                    width: withDefault(
                        this.props.innerLeft,
                        this.props.outline === "rectangle" ? height / 4 : 0
                    ),
                }}
            />
        );

        return (
            <div
                ref={this.rootRef}
                tabIndex={this.canFocus() ? 0 : -1}
                onMouseMove={this.checkHover}
                onMouseDown={this.checkActive}
                onFocus={() => {
                    this.inputRef.current?.focus();
                    this.checkFocus();
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
                    {componentList}
                </div>
            </div>
        );
    }
}
