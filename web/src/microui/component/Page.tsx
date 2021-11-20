import React from "react";
import { Theme, ThemeContext } from "../context/theme";

interface PageProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface PageState {}

export class Page extends React.Component<PageProps, PageState> {
    static contextType = ThemeContext;

    constructor(props: PageProps) {
        super(props);
        this.state = {};
    }

    render() {
        const theme: Theme = this.context;

        const body = document.body;
        body.style.padding = "0px";
        body.style.margin = "0px";
        body.style.backgroundColor = theme.default?.pageBackground || "black";

        return (
            <div
                style={{
                    background: theme.default?.pageBackground,
                    display: "flex",
                    flexFlow: "column",
                    width: "100vw",
                    height: "100vh",
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
