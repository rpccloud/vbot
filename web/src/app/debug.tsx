import React, { CSSProperties, ReactNode } from "react";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Button } from "../mircoui/component/Button";
import { Input } from "../mircoui/component/Input";
import { FocusContext } from "../mircoui";
import { Popup } from "../mircoui/component/Popup";
import { TabBar } from "../mircoui/component/TabBar";

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

const Debug = () => (
    <div
        style={{
            background: "#444",
            position: "fixed",
            width: "100vw",
            height: "100vh",
            padding: 16,
        }}
    >
        <div>
            <TabBar
                size="large"
                innerLeft={100}
                innerRight={100}
                initialFixedTabs={[
                    {
                        width: 180,
                        title: "Test",
                    },
                ]}
                initialFloatTabs={[
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
                    { title: "Test" },
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
                <Button value="Click" disabled={true} />
                <Button icon={<AiOutlineLock />} />
                <Button
                    value="Click"
                    icon={<AiOutlineLock />}
                    innerMargin={6}
                    style={{ width: 200, justifyContent: "left" }}
                />

                <Button icon={<AiOutlineLock />} round={true} />
                <Button
                    value="H"
                    style={{ width: 18, height: 18 }}
                    round={true}
                    onClick={(e) => {}}
                    focusable={false}
                />
            </Container>

            <Container width={300}>
                <FocusContext.Provider value={{ focusable: false }}>
                    <Button value="Click" disabled={true} />
                    <Button icon={<AiOutlineLock />} />
                    <Button
                        value="Click"
                        icon={<AiOutlineLock />}
                        innerMargin={6}
                        style={{ width: 200, justifyContent: "left" }}
                    />

                    <Button icon={<AiOutlineLock />} round={true} />
                    <Button
                        value="H"
                        style={{ width: 18, height: 18 }}
                        round={true}
                        onClick={(e) => {}}
                        focusable={false}
                    />
                </FocusContext.Provider>
            </Container>

            <Container width={300}>
                <div style={{ display: "flex" }}>
                    <Button value="Click" disabled={true} />
                    <Button icon={<AiOutlineLock />} />
                    <Button
                        value="Click"
                        icon={<AiOutlineLock />}
                        innerMargin={6}
                        style={{ width: 120, justifyContent: "left" }}
                    />

                    <Button icon={<AiOutlineLock />} round={true} />
                    <Button
                        value="H"
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
                    mode="bare"
                    focusable={true}
                    submittable={true}
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
                    mode="underline"
                    focusable={true}
                    submittable={true}
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
                    mode="border"
                    focusable={true}
                    submittable={true}
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
                    mode="bare"
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
                    mode="underline"
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
                    mode="border"
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
                    mode="bare"
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
                    mode="underline"
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
                    mode="border"
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

export default Debug;
