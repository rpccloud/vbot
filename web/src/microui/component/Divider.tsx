import React, { useContext } from "react";
import { SizeContext } from "../context/size";
import { ThemeContext } from "../context/theme";

interface DividerProps {
    type: "vertical" | "horizontal";
    outline: "start" | "center" | "end" | "none";
    space: number;
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
        let height = 0;
        let top = 0;
        let bottom = 0;
        switch (this.props.outline) {
            case "start":
                top = 0;
                bottom = h - 1;
                height = 1;
                break;
            case "center":
                top = (h - 1) / 2;
                bottom = (h - 1) / 2;
                height = 1;
                break;
            case "end":
                top = h - 1;
                bottom = 0;
                height = 1;
                break;
            case "none":
                top = h / 2;
                bottom = h / 2;
                height = 0;
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
        let width = 0;
        let left = 0;
        let right = 0;
        switch (this.props.outline) {
            case "start":
                left = 0;
                right = h - 1;
                width = 1;
                break;
            case "center":
                left = (h - 1) / 2;
                right = (h - 1) / 2;
                width = 1;
                break;
            case "end":
                left = h - 1;
                right = 0;
                width = 1;
                break;
            case "none":
                left = h / 2;
                right = h / 2;
                width = 0;
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
    const { size } = useContext(SizeContext);
    return <DividerCore {...props} />;
};

Divider.defaultProps = {
    type: "horizontal",
    outline: "none",
};
