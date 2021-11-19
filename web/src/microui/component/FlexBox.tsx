import React from "react";
import { Theme, ThemeContext } from "../context/theme";
import { makeTransition } from "../util";

interface FlexBoxProps {
    animated: boolean;
    flexFlow: "column" | "row";
    justifyContent:
        | "flex-start"
        | "flex-end"
        | "center"
        | "stretch"
        | "space-evenly"
        | "space-between"
        | "space-around";
    alignItems: "start" | "center" | "end" | "stretch";
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface FlexBoxState {}

class FlexBoxCore extends React.Component<FlexBoxProps, FlexBoxState> {
    static contextType = ThemeContext;

    private rootRef = React.createRef<HTMLDivElement>();

    constructor(props: FlexBoxProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.animated) {
            const theme: Theme = this.context;

            if (this.rootRef.current) {
                this.rootRef.current.style.opacity = "0";
                this.rootRef.current.style.transition = makeTransition(
                    ["opacity"],
                    theme.transition?.durationMS + "ms",
                    theme.transition?.easing
                );
                setTimeout(() => {
                    if (this.rootRef.current) {
                        this.rootRef.current.style.opacity = "1";
                    }
                }, 10);
            }
        }
    }

    render() {
        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "flex",
                    flexFlow: this.props.flexFlow,
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

export const FlexBox = (props: FlexBoxProps) => {
    return <FlexBoxCore {...props} />;
};

FlexBox.defaultProps = {
    animated: false,
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
};
