import React from "react";

interface PageProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface PageState {}

export class Page extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                style={{
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
