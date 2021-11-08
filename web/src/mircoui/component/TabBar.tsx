import React from "react";
import {
    getFontSize,
    HtmlChecker,
    ITheme,
    ResizeSensor,
    ThemeContext,
} from "..";

interface TabBarProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: ITheme;
    innerLeft?: number;
    innerRight?: number;
}

interface TabBarState {
    width: number;
}

export class TabBar extends React.Component<TabBarProps, TabBarState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private htmlChecker = new HtmlChecker(this.rootRef);
    private resizeSensor = new ResizeSensor(this.rootRef, (rect) => {
        if (rect) {
            this.setState({ width: rect.width });
        }
    });

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            width: 0,
        };
    }

    componentWillUnmount() {
        this.htmlChecker.depose();
        this.resizeSensor.close();
    }

    render() {
        let fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);

        return (
            <div
                ref={this.rootRef}
                style={{
                    height: height,
                    background: "red",
                }}
            >
                {this.state.width}
            </div>
        );
    }
}
