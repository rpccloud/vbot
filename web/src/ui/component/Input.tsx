import React, { useContext, useRef, useState } from "react";
import ThemeConfig from "../theme/config";
import { HtmlChecker } from "../util/util";

import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlineEyeInvisible } from "@react-icons/all-files/ai/AiOutlineEyeInvisible";
import { AiOutlineUnlock } from "@react-icons/all-files/ai/AiOutlineUnlock";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

interface InputIconPair {
    active: React.ReactNode
    inactive: React.ReactNode
}

interface InputContextProps {
    editIcons: InputIconPair
    passwordIcons: InputIconPair
    hasDivider: boolean
}

export const InputContext = React.createContext<InputContextProps>({
    editIcons: {
        active: <AiOutlineUnlock></AiOutlineUnlock>,
        inactive: <AiOutlineLock></AiOutlineLock>,
    },
    passwordIcons: {
        active: <AiOutlineEye></AiOutlineEye>,
        inactive: <AiOutlineEyeInvisible></AiOutlineEyeInvisible>,
    },
    hasDivider: true,
})

interface InputProps {
    value?: string,
    size: "small" | "middle" | "large",
    type: "password" | "text",
    placeholder?: string,
    label?: string,
    edit?: boolean,
    validator?: (value: any) => boolean,
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
    editIcon?: React.ReactNode
    onChange?: (e: {target: {value: any}}) => void
    onSubmit?: (value: any) => void
}

const Input = (props: InputProps) => {
    const inputEl = useRef<HTMLInputElement>(null)
    const theme = useContext(ThemeConfig)
    const config = useContext(InputContext)
    let [focus, setFocus] = useState(false)
    let [hover, setHover] = useState(false)
    let [type, setType] = useState(props.type)
    let [edit, setEdit] = useState(props.edit)
    let [value, setValue] = useState(props.value)

    let htmlChecker = new HtmlChecker(inputEl)
    let fakePassword = "000000"

    const sizeMap = {
        "small": theme.fontSizeSmall,
        "middle": theme.fontSizeMiddle,
        "large": theme.fontSizeLarge,
    }

    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                flexFlow: "row",
                border: "1px solid " +  (edit ? ((focus || hover) ? theme.primaryColor : theme.borderColor): "transparent"),
                boxShadow: (focus && edit) ? "0px 0px 4px " + theme.primaryColor: "",
                overflow: "clip",
                borderRadius: 6,
                fontSize: sizeMap[props.size],
                color: focus ? theme.primaryColor : theme.borderColor,
                padding: "8px 8px 8px 8px",
                transition : "border 300ms ease-out, box-shadow 300ms ease-out, color 300ms ease-out",
            }}
            onMouseDown={(e) => {
                if ((e.eventPhase === 2 || e.eventPhase === 3) && edit) {
                    inputEl.current && inputEl.current.focus()
                }
            }}
            onMouseMove={(e) => {
                if (htmlChecker.hasHover()) {
                    setHover(true)
                    htmlChecker.onLostHover(() => { setHover(false) })
                }
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0, right:0,
                    zIndex: -100,
                    margin: "0px 8px 0px 8px",
                    background: "transparent",
                    borderBottom: "1px solid " + (edit ? "transparent" : theme.dividerColor),
                    transition : "border 300ms ease-out",
                }}
                onMouseDown={e => {e.preventDefault()}}
            />

            <div
                style={{
                    alignItems:"center",
                    display: props.prefixIcon ? "flex" : "none",
                    margin: "0px 8px 0px 0px",
                    color: (props.validator && !props.validator(value)) ? theme.errorColor : "inherit",
                    transition : "color 300ms ease-out",
                }}
                onMouseDown={e => {e.preventDefault()}}
            >
                {props.prefixIcon}
            </div>

            <div
                style={{
                    alignItems:"center",
                    display: props.label ? "flex" : "none",
                    margin: "0px 8px 0px 0px",
                }}
                onMouseDown={e => {e.preventDefault()}}
            >
                {props.label}
            </div>

            <input
                ref={inputEl}
                style={{
                    outline: "none",
                    border: "0px",
                    width: "100%",
                    background: "transparent",
                    color: theme.fontColor,
                    fontWeight: theme.fontWeight,
                    caretColor: edit ? theme.fontColor : "transparent",
                }}
                placeholder={edit ? props.placeholder : ""}
                type={type}
                value={ (!edit && type === "password") ? fakePassword : value}
                onMouseDown={e => {
                    if (!edit) {
                        e.preventDefault()
                    }
                }}
                onFocus={e => {
                    setFocus(true)
                    htmlChecker.onLostFocus(() => { setFocus(false) })
                }}
                onChange={e => {
                    if (edit) {
                        setValue(e.target.value)
                        props.onChange && props.onChange(e)
                    } else {
                        e.preventDefault()
                    }
                }}
            />

            <div
                style={{
                    alignItems:"center",
                    display: (edit && props.type) === "password" ? "flex" : "none",
                    margin: "0px 0px 0px 8px",
                }}
                onMouseDown={e => {
                    e.preventDefault()
                    setType(type === "password" ? "text": "password")
                }}
            >
                { type === "password" ? config.passwordIcons.inactive : config.passwordIcons.active }
            </div>

            <div
                style={{
                    alignItems:"center",
                    display: props.onSubmit ? "flex" : "none",
                    margin: "0px 0px 0px 8px",
                }}
                onMouseDown={e => {
                    e.preventDefault()
                    if (edit) {
                        e.stopPropagation()
                        setEdit(false)
                        inputEl.current && inputEl.current.blur()
                        props.onSubmit && props.onSubmit(value)
                    } else {
                        setEdit(true)
                        inputEl.current && inputEl.current.focus()
                    }
                }}
                onFocus={() => {alert("error")}}
            >
                { edit ? config.editIcons.active  : config.editIcons.inactive }
            </div>
        </div>
    )
}

export default Input

