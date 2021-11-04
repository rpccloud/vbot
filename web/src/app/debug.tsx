import React from "react";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import { Button } from "../mircoui/component/Button";
import { Input } from "../mircoui/component/Input";
import { FocusContext } from "../mircoui";

const Debug = () => (
    <div className="vbot-fill-viewport" style={{ background: "#333" }}>
        <FocusContext.Provider value={{ focusable: false }}>
            <div>
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
            </div>
        </FocusContext.Provider>

        <div style={{ display: "flex" }}>
            <Button value="Click" ghost={true} disabled={true} />
            <Button
                value="Click"
                style={{ flex: 1 }}
                ghost={true}
                icon={<AiOutlineLock />}
            />
            <Button value="H" ghost={true} round={true} focusable={false} />
        </div>

        <div style={{ position: "absolute", top: 100, left: 0, width: 280 }}>
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

            <div style={{ height: 50 }} />
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

            <div style={{ height: 50 }} />
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
        </div>

        <div style={{ position: "absolute", top: 100, left: 300, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                focusable={false}
                submittable={true}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                focusable={false}
                submittable={true}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                focusable={false}
                submittable={true}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>

        <div style={{ position: "absolute", top: 100, left: 600, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                focusable={true}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                focusable={true}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                focusable={true}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>

        <div style={{ position: "absolute", top: 100, left: 900, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                focusable={false}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                focusable={false}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                focusable={false}
                submittable={false}
                icon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>
    </div>
);

export default Debug;
