import React from "react";
import { Theme, ThemeContext } from "../theme";
import { makeTransition } from "..";

interface FlexBoxProps {
    loadAnimate: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface FlexBoxState {
    init: boolean;
}

export class FlexBox extends React.Component<FlexBoxProps, FlexBoxState> {
    static contextType = ThemeContext;
    static defaultProps = {
        animated: false,
    };

    private rootRef = React.createRef<HTMLDivElement>();

    constructor(props: FlexBoxProps) {
        super(props);
        this.state = {
            init: !this.props.loadAnimate,
        };
    }

    componentDidMount() {
        if (!this.state.init) {
            setTimeout(() => {
                this.setState({ init: true });
            }, 30);
        }
    }

    render() {
        const theme: Theme = this.context;
        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "flex",
                    opacity: this.state.init ? 1 : 0,
                    transition: this.props.loadAnimate
                        ? makeTransition(
                              ["opacity"],
                              theme.transition?.durationMS + "ms",
                              theme.transition?.easing
                          )
                        : "",
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
