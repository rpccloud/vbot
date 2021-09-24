import React from "react";

interface DividerProps {
    size: string,
    top: string,
    bottom: string,
    color: string,
}

const Divider = (props: DividerProps) => (
    <div
        style={{
            width: "100%",
            height: `${props.size}px`,
            marginTop: `${props.top}px`,
            marginBottom: `${props.bottom}px`,
            backgroundColor: props.color,
        }}
    />
)

export default Divider
