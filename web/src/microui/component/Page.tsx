import React from "react";
import { Theme, ThemeContext } from "../context/theme";
import "../microui.css";

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
