import React from "react";
import { Rect } from "..";
import { ResizeSonar } from "../sonar/resize";

interface TestProps {}
interface TestState {
    rect?: Rect;
}

export class Test extends React.Component<TestProps, TestState> {
    private rootRef = React.createRef<HTMLDivElement>();
    private resizeSonar?: ResizeSonar;

    constructor(props: TestProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.resizeSonar = new ResizeSonar(this.rootRef, (rect?: Rect) => {
            this.setState({ rect: rect });
        });
    }

    componentWillUnmount() {
        setTimeout(() => {
            this.setState({ rect: { x: 0, y: 0, width: 0, height: 0 } });
        }, 1000);
        this.resizeSonar?.close();
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
