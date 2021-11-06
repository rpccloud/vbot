import React from "react";
import { ResizeSensor, ScreenRect } from "..";

interface TestProps {}
interface TestState {
    rect?: ScreenRect;
}

export class Test extends React.Component<TestProps, TestState> {
    private rootRef = React.createRef<HTMLDivElement>();
    private resizeSensor?: ResizeSensor;

    constructor(props: TestProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.resizeSensor = new ResizeSensor(
            this.rootRef,
            (rect?: ScreenRect) => {
                this.setState({ rect: rect });
            }
        );
    }

    componentWillUnmount() {
        this.resizeSensor?.close();
    }

    render() {
        return (
            <div
                style={{
                    width: "100wh",
                    height: "100vh",
                    position: "relative",
                }}
                ref={this.rootRef}
            >
                <div
                    style={{
                        position: "absolute",
                        width: 400,
                        height: 400,
                        background: "white",
                    }}
                >
                    {JSON.stringify(this.state.rect)}
                </div>
            </div>
        );
    }
}
