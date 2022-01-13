import React from "react";
import { Divider } from "..//components/Divider";
import { DebugUnit } from "./DebugUnit";
import { Span } from "../components/Span";
import { Input } from "../components/Input";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

export const DebugInput = (props: {}) => {
    return (
        <div style={{ padding: 16 }}>
            <Span size="xx-large">Popup</Span>
            <Divider space={16} />
            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <DebugUnit title="Input-default" width={300} height={150}>
                    <Input />
                    <Input icon={<AiOutlineLock />} />
                    <Input icon={<AiOutlineLock />} label="label" />
                </DebugUnit>

                <DebugUnit title="Input-password" width={300} height={150}>
                    <Input type="password" />
                    <Input type="password" icon={<AiOutlineLock />} />
                    <Input
                        type="password"
                        icon={<AiOutlineLock />}
                        label="label"
                    />
                </DebugUnit>
            </div>
        </div>
    );
};
