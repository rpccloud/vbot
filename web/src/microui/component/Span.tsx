import React, { useContext } from "react";
import { SizeContext } from "../context/size";
import { ThemeContext } from "../context/theme";

import { getFontSize, sizeKind } from "../util";

interface SpanProps {
    text: string;
    size?: sizeKind;
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
        let fontSize = getFontSize(this.props.size || "medium");

        return (
            <span
                style={{
                    fontSize: fontSize,
                    color:
                        this.props.color || this.context.default.contrastText,
                    padding: 0,
                    margin: 0,
                    border: 0,
                    ...this.props.style,
                }}
            >
                {this.props.text}
            </span>
        );
    }
}

export const Span = (props: SpanProps) => {
    const { size } = useContext(SizeContext);
    return <SpanCore {...props} size={props.size || size} />;
};

Span.defaultProps = {
    text: "",
};
