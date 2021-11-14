import React, { CSSProperties } from "react";
import { ThemeContext } from "../context/theme";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { getFontSize } from "../config";

interface SpinProps {
    size: "tiny" | "small" | "medium" | "large" | "xLarge" | "xxLarge";
    icon: React.ReactNode;
    color?: string;
    speed: number;
    style?: CSSProperties;
}

interface SpinState {
    angle: number;
}

export class Spin extends React.Component<SpinProps, SpinState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        speed: 1,
        icon: <AiOutlineLoading3Quarters />,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private timer?: number;

    constructor(props: SpinProps) {
        super(props);
        this.state = {
            angle: 0,
        };
    }

    componentDidMount() {
        this.timer = window.setInterval(() => {
            this.setState((old) => {
                return {
                    angle: old.angle + 4 * this.props.speed,
                };
            });
        }, 25);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    render() {
        let color =
            this.props.color !== undefined
                ? this.props.color
                : this.context.primary.main;
        let fontSize = getFontSize(this.props.size);
        let width =
            this.props.style?.width !== undefined
                ? this.props.style?.width
                : fontSize;
        let height =
            this.props.style?.height !== undefined
                ? this.props.style?.height
                : fontSize;
        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "block",
                    ...this.props.style,
                    width: width,
                    height: height,
                }}
            >
                <div
                    style={{
                        width: width,
                        height: height,
                        fontSize: fontSize,
                        color: color,
                        transformOrigin: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `rotate(${this.state.angle}deg)`,
                    }}
                >
                    {this.props.icon}
                </div>
            </div>
        );
    }
}
