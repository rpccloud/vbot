import React from "react";
import { Page } from "./components/Page";
import { DebugButton } from "./debug/Button";

interface DebugProps {}

interface DebugState {}

export class NuiDebug extends React.Component<DebugProps, DebugState> {
    constructor(props: DebugProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Page background={"#222"} style={{ padding: 16 }}>
                <DebugButton />
            </Page>
        );
    }
}
