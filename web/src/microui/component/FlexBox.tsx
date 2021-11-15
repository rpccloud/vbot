import React from "react";

interface FlexBoxProps {
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
    constructor(props: FlexBoxProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
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
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
};
