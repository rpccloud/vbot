import React from "react";
import { getFontSize, withDefault } from "..";
import { Theme, ThemeContext } from "../theme";

interface PageProps {
    children?: React.ReactNode;
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

        const body = document.body;
        body.style.padding = "0px";
        body.style.margin = "0px";
        body.style.backgroundColor = theme.palette.default.main;

        return (
            <div
                style={{
                    display: "flex",
                    flexFlow: "column",
                    fontSize: withDefault(
                        this.props.style?.fontSize,
                        getFontSize(theme.size)
                    ),
                    background: theme.palette.default.main,
                    ...this.props.style,
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
