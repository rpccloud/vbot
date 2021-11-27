import React from "react";
import { Theme, ThemeContext } from "../theme";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { getFontSize, Size, UiCSSProperties, withDefault } from "..";
import { TimerManager } from "../utils/time-manager";

type RenderIconFunction = (
    theme: Theme,
    width: number,
    height: number
) => React.ReactNode;

interface SpinProps {
    size: Size;
    icon: React.ReactNode | RenderIconFunction;
    speed: number;
    style?: UiCSSProperties;
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
        if (this.timer === undefined) {
            this.timer = TimerManager.attach(this);
            TimerManager.fast(this.timer);
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            TimerManager.detach(this.timer);
            this.timer = undefined;
        }
    }

    onTimer(): void {
        this.setState((old) => {
            return {
                angle: old.angle + 4 * this.props.speed,
            };
        });
    }

    render() {
        const theme: Theme = this.context;

        let color = withDefault(
            this.props.style?.color,
            theme.palette.primary.main
        );

        let fontSize = getFontSize(withDefault(this.props.size, theme.size));
        let width = withDefault(this.props.style?.width, fontSize);
        let height = withDefault(this.props.style?.height, fontSize);

        let icon =
            typeof this.props.icon === "function"
                ? this.props.icon(theme, width, height)
                : this.props.icon;

        return (
            <div
                ref={this.rootRef}
                style={{
                    display: "inline-block",
                    ...this.props.style,
                    width: width,
                    height: height,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        fontSize: fontSize,
                        color: color,
                        transformOrigin: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `rotate(${this.state.angle}deg)`,
                    }}
                >
                    {icon}
                </div>
            </div>
        );
    }
}
