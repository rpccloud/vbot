import React, { useContext, useState } from "react";
import ThemeConfig from "../theme/config";

interface InputProps {
    value?: string,
    size: "small" | "middle" | "large",
    editable: boolean,
    validator?: (value: any) => boolean,
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
    editIcon?: React.ReactNode
}

export default (props: InputProps) => {
    const theme = useContext(ThemeConfig);
    let [edit, SetEdit] = useState(props.editable)

    const sizeMap = {
        "small": theme.fontSizeSmall,
        "middle": theme.fontSizeMiddle,
        "large": theme.fontSizeLarge,
    }

    return (
        <div
            style={{
                border: edit ? "1px solid " + theme.borderColor: "0px",
                overflow: "clip",
                borderRadius: 6,
            }}
        >
            <input
                style={{
                    outline: "none",
                    border: "0px",
                    width: "100%",
                    background: "transparent",
                    color: theme.fontColor,
                    fontSize: sizeMap[props.size],
                    fontWeight: theme.fontWeight,
                }}
                value={props.value}
            />
        </div>
    )
}

