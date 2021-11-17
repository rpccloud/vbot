import React, { CSSProperties, ReactNode, useState } from "react";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

import { Button } from "../microui/component/Button";
import { Input } from "../microui/component/Input";
import { Popup } from "../microui/component/Popup";
import { FocusContext } from "../microui/context/focus";
import { Spin } from "../microui/component/Spin";
import { TabBar } from "../microui/component/TabBar";
import { sleep } from "../microui/util";
import { FadeBox } from "../microui/component/FadeBox";

const Container = (props: {
    children: ReactNode;
    width: number;
    style?: CSSProperties;
}) => (
    <div
        style={{
            width: props.width,
            border: "1px solid white",
            margin: 16,
            padding: 16,
            borderRadius: 16,
            background: "#333",
            ...props.style,
        }}
    >
        {props.children}
    </div>
);

const Debug = () => {
    const [click, setClick] = useState(false);

    return (
        <div
            style={{
                background: "#111",
                position: "fixed",
                width: "100vw",
                height: "100vh",
                padding: 16,
            }}
        >
            <div style={{ position: "absolute", top: 100, display: "none" }}>
                <svg
                    viewBox="0 0 1 1"
                    width="1"
                    height="1"
                    style={{ overflow: "visible" }}
                >
                    <filter id="shadow">
                        <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="2"
                            style={{
                                floodColor: click ? "yellow" : "blue",
                                transition: "flood-color 250ms ease-in",
                            }}
                        />
                    </filter>

                    <path
                        id="heart"
                        filter="url(#shadow)"
                        d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z"
                        stroke={click ? "yellow" : "blue"}
                        fill="red"
                        style={{
                            transition: "stroke 250ms ease-in",
                            boxShadow: `0px 0px 4px red`,
                        }}
                        onClick={() => {
                            setClick(!click);
                        }}
                    />
                </svg>
            </div>

            <div>
                <FadeBox fade={0.5} type="bottom">
                    <Button text="Click" ghost={true} />
                </FadeBox>

                <TabBar
                    size="large"
                    style={{ fontWeight: 500 }}
                    initialFixedTabs={[
                        {
                            width: 180,
                            title: "Test",
                            default: true,
                        },
                    ]}
                    initialFloatTabs={[
                        {
                            title: "TestTestTestTestTestTestTestTestTestTestTestTest",
                            icon: <AiOutlineLock />,
                        },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                    initialDynamicTabs={[
                        {
                            title: "TestTestTestTestTestTestTest",
                            icon: <AiOutlineLock />,
                        },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                        { title: "Test", icon: <AiOutlineLock /> },
                    ]}
                ></TabBar>
            </div>

            <Container width={600}>
                <Popup
                    renderPopup={(rect, closePopup) => {
                        return (
                            <div>
                                <Popup
                                    renderPopup={(rect, closePopup) => {
                                        return (
                                            <div
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    background: "red",
                                                }}
                                                onClick={() => {
                                                    closePopup();
                                                }}
                                            ></div>
                                        );
                                    }}
                                >
                                    <Button icon={<AiOutlineLock />} />
                                </Popup>
                                <div
                                    style={{
                                        width: 200,
                                        height: 200,
                                        background: "red",
                                    }}
                                    onClick={() => {
                                        closePopup();
                                    }}
                                ></div>
                            </div>
                        );
                    }}
                >
                    <Button icon={<AiOutlineLock />} />
                </Popup>
            </Container>

            <div style={{ display: "flex", flexFlow: "row" }}>
                <Container width={300}>
                    <Button text="Click" disabled={true} />
                    <Button icon={<AiOutlineLock />} />
                    <Button
                        text="Click"
                        icon={<AiOutlineLock />}
                        innerMargin={6}
                        style={{ width: 200, justifyContent: "left" }}
                    />

                    <Button icon={<AiOutlineLock />} round={true} />
                    <Button
                        text="H"
                        style={{ width: 18, height: 18 }}
                        round={true}
                        onClick={(e) => {}}
                        focusable={false}
                    />
                </Container>

                <Container width={300}>
                    <FocusContext.Provider value={{ focusable: true }}>
                        <Button text="Click" ghost={true} disabled={true} />
                        <Button icon={<AiOutlineLock />} ghost={true} />
                        <Button
                            text="Click"
                            icon={<AiOutlineLock />}
                            innerMargin={6}
                            ghost={true}
                            style={{ width: 200, justifyContent: "left" }}
                        />

                        <Button
                            icon={<AiOutlineLock />}
                            round={true}
                            ghost={true}
                        />
                        <Button
                            text="H"
                            style={{ width: 18, height: 18 }}
                            ghost={true}
                            round={true}
                            theme={{
                                primary: { main: "red", contrastText: "green" },
                            }}
                            onClick={(e) => {}}
                            focusable={false}
                        />
                    </FocusContext.Provider>
                </Container>

                <Container width={300}>
                    <div style={{ display: "flex" }}>
                        <Button text="Click" disabled={true} />
                        <Button icon={<AiOutlineLock />} />
                        <Button
                            text="Click"
                            icon={<AiOutlineLock />}
                            innerMargin={6}
                            style={{ width: 120, justifyContent: "left" }}
                        />

                        <Button icon={<AiOutlineLock />} round={true} />
                        <Button
                            text="H"
                            style={{ width: 18, height: 18 }}
                            round={true}
                            onClick={(e) => {}}
                            focusable={false}
                        />
                    </div>
                </Container>
            </div>

            <div style={{ display: "flex", flexFlow: "row" }}>
                <Container width={300}>
                    <Input
                        defaultValue="1234"
                        outline="bare"
                        focusable={true}
                        submittable={true}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            await sleep(2000);
                            return false;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="Test"
                        outline="underline"
                        focusable={true}
                        submittable={true}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            await sleep(2000);
                            return true;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="1234"
                        outline="border"
                        focusable={true}
                        submittable={true}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            await sleep(2000);
                            return false;
                        }}
                    />
                </Container>
                <Container width={300}>
                    <Input
                        defaultValue="1234"
                        outline="bare"
                        focusable={true}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return false;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="1234"
                        outline="underline"
                        focusable={true}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return true;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="12341323413412aasdfasdfasdf"
                        outline="border"
                        focusable={true}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return false;
                        }}
                    />
                </Container>
                <Container width={300}>
                    <Input
                        defaultValue="1234"
                        outline="bare"
                        focusable={false}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return false;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="1234"
                        outline="underline"
                        focusable={false}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return true;
                        }}
                    />
                    <div style={{ height: 20 }} />
                    <Input
                        defaultValue="1234"
                        outline="border"
                        focusable={false}
                        submittable={false}
                        icon={<AiOutlineLock />}
                        label="Name:"
                        placeholder="placeholder"
                        onSubmit={async () => {
                            return false;
                        }}
                    />
                </Container>
            </div>
        </div>
    );
};

export default Debug;
