import React from "react";
import { Divider } from "../../microui/component/Divider";
import { DebugUnit } from "./DebugUnit";

// import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Spin } from "../components/Spin";
import { Span } from "../components/Span";

export const DebugSpin = (props: {}) => {
    const VSpacer = <Divider type="vertical" space={16} />;
    return (
        <div style={{ padding: 16 }}>
            <Span size="xx-large">Spin</Span>
            <Divider space={16} />
            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <DebugUnit title="Spin-default" width={150} height={150}>
                    <Spin />
                </DebugUnit>

                <DebugUnit title="Spin-size" width={150} height={150}>
                    <Spin size="xxx-small" />
                    {VSpacer}
                    <Spin size="xx-small" />
                    {VSpacer}
                    <Spin size="x-small" />
                    {VSpacer}
                    <Spin size="small" />
                    {VSpacer}
                    <Spin size="medium" />
                    {VSpacer}
                    <Spin size="large" />
                    {VSpacer}
                    <Spin size="x-large" />
                    {VSpacer}
                    <Spin size="xx-large" />
                    {VSpacer}
                    <Spin size="xxx-large" />
                </DebugUnit>
            </div>
        </div>
    );
};
