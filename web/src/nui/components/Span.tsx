import React, { useContext } from "react";
import { Theme, ThemeContext } from "../theme";

import { getFontSize, makeTransition, Size, withDefault } from "..";

interface SpanProps {
    children?: React.ReactNode;
    size?: Size;
    color?: string;
    style?: React.CSSProperties;
}

interface SpanState {}

class Span extends React.Component<SpanProps, SpanState> {
    static contextType = ThemeContext;

    constructor(props: SpanProps) {
        super(props);
        this.state = {};
    }

    render() {
        let theme: Theme = this.context;
        let fontSize = getFontSize(withDefault(this.props.size, theme.size));

        return (
            <span
                style={{
                    fontSize: fontSize,
                    color:
                        this.props.color || theme.palette.default.contrastText,
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
