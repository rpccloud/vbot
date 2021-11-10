import React from "react";
import { Rect } from "..";
import { ResizeSensor } from "../sensor/resize";

interface TestProps {}
interface TestState {
    rect?: Rect;
}

export class Test extends React.Component<TestProps, TestState> {
    private rootRef = React.createRef<HTMLDivElement>();
    private resizeSensor?: ResizeSensor;

    constructor(props: TestProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.resizeSensor = new ResizeSensor(this.rootRef, (rect?: Rect) => {
            this.setState({ rect: rect });
        });
    }

    componentWillUnmount() {
        setTimeout(() => {
            this.setState({ rect: { x: 0, y: 0, width: 0, height: 0 } });
        }, 1000);
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
