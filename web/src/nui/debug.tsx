import React from "react";
import { Button } from "./components/Button";
import { Page } from "./components/Page";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

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
                <Button icon={<AiOutlineLock />} round={true} />
            </Page>
        );
    }
}
