import React from "react";
import { extendTheme, Theme, ThemeContext } from "../context/theme";
import { getFontSize, sizeKind } from "../util";

interface FlexBoxProps {
    flexFlow: "column" | "row";
    justifyContent:
        | "left"
        | "center"
        | "right"
        | "stretch"
        | "space-evenly"
        | "space-between"
        | "space-around";
    alignItems: "start" | "center" | "end" | "stretch";
    style?: React.CSSProperties;
    theme?: Theme;
    size: sizeKind;
    children?: React.ReactNode;
}

interface FlexBoxState {}

export class FlexBox extends React.Component<FlexBoxProps, FlexBoxState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",
    };

    constructor(props: FlexBoxProps) {
        super(props);
        this.state = {};
    }

    render() {
        const theme = extendTheme(this.context, this.props.theme);

        return (
            <div
                style={{
                    display: "flex",
                    flexFlow: this.props.flexFlow,
                    fontSize: getFontSize(this.props.size),
                    color: theme.default?.contrastText,
                    justifyContent: this.props.justifyContent,
                    alignItems: this.props.alignItems,
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
