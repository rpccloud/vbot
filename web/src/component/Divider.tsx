import React, { CSSProperties } from "react";

interface DividerProps {
    style?: CSSProperties,
}

const Divider = (props: DividerProps) => (
    <div style={props.style} />
)

export default Divider
