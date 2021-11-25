import React from "react";
import { Span } from "../../microui/component/Span";
import { Divider } from "../components/Divider";
import { Theme, ThemeContext } from "../theme";

export const DebugUnit = (props: {
    width: number;
    height: number;
    title?: string;
    desc?: string;
    children?: React.ReactNode;
}) => {
    const theme: Theme = React.useContext(ThemeContext);
    return (
        <div
            style={{
                padding: 16,
                margin: 16,
                width: props.width,
                height: props.height,
                display: "flex",
                flexFlow: "column",
                border: "1px solid " + theme.palette.outline,
                borderRadius: theme.borderRadius,
            }}
        >
            <Span size="large">{props.title}</Span>
            <Span size="small">{props.desc}</Span>
            <Divider space={10} />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexFlow: "row",
                    flexWrap: "wrap",
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
