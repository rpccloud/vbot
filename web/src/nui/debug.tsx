import React from "react";
import { Button } from "./components/Button";
import { Page } from "./components/Page";

interface DebugProps {}

interface DebugState {}

export class NuiDebug extends React.Component<DebugProps, DebugState> {
    constructor(props: DebugProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Page>
                <Button label="test" />
            </Page>
        );
    }
}
