import React from "react";
import { Divider } from "..//components/Divider";
import { DebugUnit } from "./DebugUnit";
import { Span } from "../components/Span";
import { Popup } from "../components/Popup";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export const DebugInput = (props: {}) => {
    return (
        <div style={{ padding: 16 }}>
            <Span size="xx-large">Popup</Span>
            <Divider space={16} />
            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <DebugUnit title="Input-default" width={150} height={150}>
                    <Input />
                </DebugUnit>
            </div>
        </div>
    );
};
