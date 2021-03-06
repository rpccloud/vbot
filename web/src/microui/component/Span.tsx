import React, { useContext } from "react";
import { SizeContext } from "../context/size";
import { Theme, ThemeContext } from "../context/theme";

import { getFontSize, makeTransition, Size } from "../util";

interface SpanProps {
    children?: React.ReactNode;
    size?: Size;
    color?: string;
    style?: React.CSSProperties;
}

interface SpanState {}

class SpanCore extends React.Component<SpanProps, SpanState> {
    static contextType = ThemeContext;

    constructor(props: SpanProps) {
        super(props);
        this.state = {};
    }

    render() {
        let theme: Theme = this.context;
        let fontSize = getFontSize(this.props.size || "medium");

        return (
            <span
                style={{
                    fontSize: fontSize,
                    color: this.props.color || theme.primary?.contrastText,
                    padding: 0,
                    margin: 0,
                    border: 0,
                    transition: makeTransition(
                        ["color"],
                        theme.transition?.durationMS + "ms",
                        theme.transition?.easing
                    ),
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </span>
        );
    }
}

export const Span = (props: SpanProps) => {
    const { size } = useContext(SizeContext);
    return <SpanCore {...props} size={props.size || size} />;
};
