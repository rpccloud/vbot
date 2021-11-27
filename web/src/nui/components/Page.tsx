import React from "react";
import { withDefault } from "..";
import { Theme, ThemeContext } from "../theme";

interface PageProps {
    children?: React.ReactNode;
    background?: string;
    style?: React.CSSProperties;
}

export class Page extends React.Component<PageProps, {}> {
    static contextType = ThemeContext;

    constructor(props: PageProps) {
        super(props);
        this.state = {};
    }

    render() {
        const theme: Theme = this.context;
        const background = withDefault(
            this.props.background,
            theme.palette.default.main
        );

        const body = document.body;
        body.style.padding = "0px";
        body.style.margin = "0px";
        body.style.backgroundColor = background;

        return (
            <div
                style={{
                    background: background,
                    ...this.props.style,
                    display: "flex",
                    flexFlow: "column",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
