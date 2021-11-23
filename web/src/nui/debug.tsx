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
        let array: number[] = [];
        for (let i = 0; i < 10; i++) {
            array.push(i);
        }
        return (
            <Page background="white">
                {array.map((it, index) => {
                    return (
                        <Button
                            key={it}
                            round={true}
                            icon={<AiOutlineLock />}
                            ghost={index % 2 === 0}
                        />
                    );
                })}
            </Page>
        );
    }
}
