import React from "react";
import { Divider } from "../../microui/component/Divider";
import { Button } from "../components/Button";
import { Span } from "../components/Span";
import { DebugUnit } from "./DebugUnit";

import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { sleep } from "../../microui/util";

export const DebugButton = (props: {}) => {
    const VSpacer = <Divider type="vertical" space={16} />;
    return (
        <div style={{ padding: 16 }}>
            <Span size="xx-large">Button</Span>
            <Divider space={16} />
            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <DebugUnit
                    title="empty button"
                    desc="all the props is default"
                    width={150}
                    height={150}
                >
                    <Button />
                </DebugUnit>
                <DebugUnit
                    title="round button"
                    desc="with only startIcon"
                    width={150}
                    height={150}
                >
                    <Button
                        round={true}
                        ghost={false}
                        startIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        shadowEffect={false}
                        startIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={false}
                        border={false}
                        startIcon={<AiOutlineLock />}
                    />
                </DebugUnit>
                <DebugUnit
                    title="round button"
                    desc="with only label"
                    width={150}
                    height={150}
                >
                    <Button round={true} ghost={false} label="H" />
                    {VSpacer}
                    <Button round={true} ghost={true} label="H" />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        label="H"
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        shadowEffect={false}
                        label="H"
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={true}
                        border={false}
                        label="H"
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={false}
                        border={false}
                        label="H"
                    />
                </DebugUnit>

                <DebugUnit
                    title="round button"
                    desc="with only endIcon"
                    width={150}
                    height={150}
                >
                    <Button
                        round={true}
                        ghost={false}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        shadowEffect={false}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={true}
                        border={false}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={false}
                        border={false}
                        endIcon={<AiOutlineLock />}
                    />
                </DebugUnit>

                <DebugUnit
                    title="round button"
                    desc="with startIcon label endIcon"
                    width={150}
                    height={150}
                >
                    <Button
                        round={true}
                        ghost={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        shadowEffect={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        disabled={true}
                        ghost={false}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                </DebugUnit>

                <DebugUnit
                    title="round button"
                    desc="set very large height"
                    width={200}
                    height={150}
                >
                    <Button
                        round={true}
                        ghost={false}
                        style={{ height: 90 }}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        style={{ height: 90 }}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                </DebugUnit>

                <DebugUnit title="ghost button" width={180} height={150}>
                    <Button round={true} ghost={true} label={"H"} />
                    {VSpacer}
                    <Button
                        round={false}
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        label={"H"}
                    />
                    {VSpacer}
                    <Button
                        round={false}
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        endIcon={<AiOutlineLock />}
                    />
                </DebugUnit>

                <DebugUnit title="border button" width={260} height={150}>
                    <Button round={true} ghost={true} label={"H"} />
                    {VSpacer}
                    <Button
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                    />
                    {VSpacer}
                    <Button
                        ghost={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        config={{ border: { normal: "red" } }}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        border={false}
                        label={"H"}
                    />
                    {VSpacer}
                    <Button
                        ghost={true}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                    />
                    {VSpacer}
                    <Button
                        ghost={false}
                        border={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        config={{ border: { normal: "red" } }}
                    />
                </DebugUnit>

                <DebugUnit title="Button-async" width={260} height={150}>
                    <Button
                        round={true}
                        ghost={true}
                        label="H"
                        onClick={async () => {
                            await sleep(2000);
                        }}
                    />
                    {VSpacer}
                    <Button
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        onClick={async () => {
                            await sleep(2000);
                        }}
                    />
                    {VSpacer}
                    <Button
                        ghost={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        onClick={async () => {
                            await sleep(2000);
                        }}
                    />
                    {VSpacer}
                    <Button
                        round={true}
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        onClick={(): any => {
                            return true;
                        }}
                    />
                    {VSpacer}
                    <Button
                        ghost={true}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        onClick={(): any => {
                            return true;
                        }}
                    />
                    {VSpacer}
                    <Button
                        ghost={false}
                        startIcon={<AiOutlineLock />}
                        label={"Button"}
                        onClick={(): any => {
                            return true;
                        }}
                    />
                </DebugUnit>
            </div>
        </div>
    );
};
