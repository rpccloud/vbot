import React from "react";
import { range } from "../util";

interface FadeBoxProps {
    type: "top" | "bottom" | "left" | "right";
    fade: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface FadeBoxState {}

export class FadeBox extends React.Component<FadeBoxProps, FadeBoxState> {
    static defaultProps = {
        type: "right",
        fade: 0.1,
    };

    private rootRef = React.createRef<HTMLDivElement>();

    constructor(props: FadeBoxProps) {
        super(props);
        this.state = {};
    }

    render() {
        const fade = range(this.props.fade, 0, 1);

        let start = "";
        let end = "";
        let startOpacity = 0;
        let ctrlOpacity = 0;
        let endOpacity = 0;
        let fadePercentage = 0;

        switch (this.props.type) {
            case "left":
                start = "left top";
                end = "right top";
                startOpacity = 0;
                ctrlOpacity = 1;
                endOpacity = 1;
                fadePercentage = fade;
                break;
            case "right":
                start = "left top";
                end = "right top";
                startOpacity = 1;
                ctrlOpacity = 1;
                endOpacity = 0;
                fadePercentage = 1 - fade;
                break;
            case "top":
                start = "left top";
                end = "left bottom";
                startOpacity = 0;
                ctrlOpacity = 1;
                endOpacity = 1;
                fadePercentage = fade;
                break;
            case "bottom":
                start = "left top";
                end = "left bottom";
                startOpacity = 1;
                ctrlOpacity = 1;
                endOpacity = 0;
                fadePercentage = 1 - fade;
                break;
        }

        return (
            <div
                ref={this.rootRef}
                style={{
                    WebkitMaskImage: `-webkit-gradient(linear, ${start}, ${end}, color-stop(0.00, rgba(0,0,0,${startOpacity})), color-stop(${fadePercentage},  rgba(0,0,0,${ctrlOpacity})),  color-stop(1,  rgba(0,0,0,${endOpacity})))`,
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
