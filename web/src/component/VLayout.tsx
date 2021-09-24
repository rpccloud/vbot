import React from "react";

const containerStyle = {
    display: "flex",
    flexFlow: "column nowrap",
    width: "100%",
    height: "100%"
}

const dynamicStyle = {
    flex:1
}

const Container = (props: { children?: any, className?: string }) => (
    <div className={props.className} style={containerStyle}>
        {props.children}
    </div>
)

const Fixed = (props: { children?: any, className?: string }) => (
    <div className={props.className}>
        {props.children}
    </div>
)

const Dynamic = (props: { children?: any, className?: string }) => (
    <div className={props.className} style={dynamicStyle}>
        {props.children}
    </div>
)

const VLayout = {
    Container,
    Fixed,
    Dynamic,
}

export default VLayout
