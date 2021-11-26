import React from "react";
import { extendConfig } from "..";
import { Theme, ThemeContext } from "../theme";

interface ConfigProps {
    value: Theme;
    children?: React.ReactNode;
}

interface ConfigState {}

export class Config extends React.Component<ConfigProps, ConfigState> {
    static contextType = ThemeContext;
    static defaultProps = {
        value: {},
    };

    constructor(props: ConfigProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ThemeContext.Provider
                value={extendConfig(this.context, this.props.value)}
            >
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}
