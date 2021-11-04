import React from "react";
import { ResizeSensor } from "..";

interface TestProps {}
interface TestState {
    width?: number;
    height?: number;
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
            (width?: number, height?: number) => {
                this.setState({
                    width: width,
                    height: height,
                });
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
                        top: this.state.height
                            ? this.state.height / 2 - 100
                            : 0,
                        left: this.state.width ? this.state.width / 2 - 100 : 0,
                        width: 200,
                        height: 200,
                        background: "white",
                    }}
                >
                    {JSON.stringify(this.state)}
                </div>
            </div>
        );
    }
}
