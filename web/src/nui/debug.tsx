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
            <Page background={"#222"}>
                <div style={{ display: "flex", margin: 10 }}>
                    <Button
                        // icon={<AiOutlineLock />}
                        label="H"
                        round={true}
                        ghost={true}
                    />
                    <Button
                        startIcon={<AiOutlineLock />}
                        round={false}
                        ghost={true}
                    />
                    <Button
                        startIcon={<AiOutlineLock />}
                        round={true}
                        ghost={false}
                        startIconSize="xxx-large"
                    />
                    <Divider type="vertical" space={10} />
                    <Button
                        startIcon={<AiOutlineLock />}
                        round={false}
                        ghost={false}
                    />
                    <Divider type="vertical" space={10} />
                    <Button
                        startIcon={() => {
                            return <AiOutlineLock />;
                        }}
                        label={() => {
                            return "aabbccddeeffgg";
                        }}
                        endIcon={<AiOutlineLock />}
                        round={false}
                        ghost={false}
                        border={false}
                        config={{
                            border: {
                                hover: "red",
                                active: "green",
                            },
                        }}
                        startIconSize={"large"}
                        endIconSize={"large"}
                        startMarginLeft={10}
                        endMarginRight={10}
                        labelWidth={30}
                        width={100}
                    />
                </div>
            </Page>
        );
    }
}
