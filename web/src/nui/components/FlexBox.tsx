import React from "react";
import { Theme, ThemeContext } from "../theme";
import { makeTransition } from "..";

interface FlexBoxProps {
    animated: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface FlexBoxState {}

export class FlexBox extends React.Component<FlexBoxProps, FlexBoxState> {
    static contextType = ThemeContext;
    static defaultProps = {
        animated: false,
    };

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
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
