import React from "react";
import { ThemeContext } from "../context/theme";

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
        const config = this.context.default;

        return (
            <div
                style={{
                    background: config?.makeBackground(
                        config.backgroundLight,
                        config.backgroundDark
                    ),
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
