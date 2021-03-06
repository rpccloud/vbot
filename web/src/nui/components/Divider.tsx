import React from "react";
import { withDefault } from "..";
import { Theme, ThemeContext } from "../theme";

interface DividerProps {
    type: "vertical" | "horizontal";
    linePosition: "start" | "center" | "end";
    lineWidth: number;
    lineColor?: string;
    space: number;
}

export class Divider extends React.Component<DividerProps, {}> {
    static contextType = ThemeContext;
    static defaultProps = {
        type: "horizontal",
        linePosition: "center",
        lineWidth: 0,
    };

    constructor(props: DividerProps) {
        super(props);
        this.state = {};
    }

    render() {
        return this.props.type === "vertical" ? this.renderV() : this.renderH();
    }

    private renderH() {
        let theme: Theme = this.context;
        let h = this.props.space;
        let lw = this.props.lineWidth;
        let height = 0;
        let top = 0;
        let bottom = 0;
        switch (this.props.linePosition) {
            case "start":
                top = 0;
                bottom = h - lw;
                height = lw;
                break;
            case "center":
                top = (h - lw) / 2;
                bottom = (h - lw) / 2;
                height = lw;
                break;
            case "end":
                top = h - lw;
                bottom = 0;
                height = lw;
                break;
        }
        const color = withDefault(this.props.lineColor, theme.palette.divider);
        return (
            <div
                style={{
                    backgroundColor: color,
                    marginTop: top,
                    marginBottom: bottom,
                    height: height,
                }}
            />
        );
    }

    private renderV() {
        let theme: Theme = this.context;
        let h = this.props.space;
        let lw = this.props.lineWidth;
        let width = 0;
        let left = 0;
        let right = 0;
        switch (this.props.linePosition) {
            case "start":
                left = 0;
                right = h - lw;
                width = lw;
                break;
            case "center":
                left = (h - lw) / 2;
                right = (h - lw) / 2;
                width = lw;
                break;
            case "end":
                left = h - lw;
                right = 0;
                width = lw;
                break;
        }
        const color = withDefault(this.props.lineColor, theme.palette.divider);
        return (
            <div
                style={{
                    backgroundColor: color,
                    marginLeft: left,
                    marginRight: right,
                    width: width,
                }}
            />
        );
    }
}

export const VDivider = (props: DividerProps) => {
    return <Divider {...props} type="vertical" />;
};

export const HDivider = (props: DividerProps) => {
    return <Divider {...props} type="horizontal" />;
};
