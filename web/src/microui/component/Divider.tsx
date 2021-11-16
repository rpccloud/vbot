import React from "react";
import { ThemeContext } from "../context/theme";

interface DividerProps {
    type: "vertical" | "horizontal";
    outline: "start" | "center" | "end";
    space: number;
    lineWidth: number;
    color?: string;
    style?: React.CSSProperties;
}

interface DividerState {}

class DividerCore extends React.Component<DividerProps, DividerState> {
    static contextType = ThemeContext;

    constructor(props: DividerProps) {
        super(props);
        this.state = {};
    }

    render() {
        return this.props.type === "vertical" ? this.renderV() : this.renderH();
    }

    private renderH() {
        let h = this.props.space;
        let lw = this.props.lineWidth;
        let height = 0;
        let top = 0;
        let bottom = 0;
        switch (this.props.outline) {
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
        return (
            <div
                style={{
                    backgroundColor: this.props.color || "transparent",
                    marginTop: top,
                    marginBottom: bottom,
                    ...this.props.style,
                    height: height,
                }}
            />
        );
    }

    private renderV() {
        let h = this.props.space;
        let lw = this.props.lineWidth;
        let width = 0;
        let left = 0;
        let right = 0;
        switch (this.props.outline) {
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
        return (
            <div
                style={{
                    backgroundColor: this.props.color || "transparent",
                    marginLeft: left,
                    marginRight: right,
                    ...this.props.style,
                    width: width,
                }}
            />
        );
    }
}

export const Divider = (props: DividerProps) => {
    return <DividerCore {...props} />;
};

Divider.defaultProps = {
    type: "horizontal",
    lineWidth: 0,
    outline: "center",
};
