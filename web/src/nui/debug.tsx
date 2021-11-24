import React from "react";
import { Button } from "./components/Button";
import { Page } from "./components/Page";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Divider } from "../microui/component/Divider";

interface DebugProps {}

interface DebugState {}

export class NuiDebug extends React.Component<DebugProps, DebugState> {
    constructor(props: DebugProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Page background={"#fff"}>
                <div style={{ display: "flex", margin: 10 }}>
                    <Button
                        // icon={<AiOutlineLock />}
                        label="H"
                        round={true}
                        ghost={true}
                    />
                    <Button
                        icon={<AiOutlineLock />}
                        round={false}
                        ghost={true}
                    />
                    <Button
                        icon={<AiOutlineLock />}
                        round={true}
                        ghost={false}
                    />
                    <Divider type="vertical" space={10} />
                    <Button
                        icon={<AiOutlineLock />}
                        round={false}
                        ghost={false}
                    />
                    <Divider type="vertical" space={10} />
                    <Button
                        icon={<AiOutlineLock />}
                        round={false}
                        ghost={true}
                        border={false}
                        config={{
                            border: {
                                hover: "red",
                                active: "green",
                            },
                        }}
                        label="Test"
                        labelSize="large"
                    />
                </div>
            </Page>
        );
    }
}
