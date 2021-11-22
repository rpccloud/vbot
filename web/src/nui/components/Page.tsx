import React from "react";
import { Theme, ThemeContext } from "../theme";

interface PageProps {
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
        body.style.backgroundColor = theme.palette.background;

        return (
            <div
                style={{
                    background: theme.palette.background,
                    display: "flex",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
