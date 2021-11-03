import React from "react";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import Input from "../ui/component/Input";
import { Button } from "../mircoui/component/Button";
import { Color } from "../ui/theme/config";

const Debug = () => (
    <div className="vbot-fill-viewport" style={{ background: "#333" }}>
        <div>
            <Button
                value="Click"
                icon={<AiOutlineLock />}
                innerMargin={6}
                style={{ width: 200, justifyContent: "left" }}
                config={{
                    hover: {
                        font: "red",
                    },
                }}
            />
        </div>

        <div style={{ position: "absolute", top: 100, left: 0, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                editable={true}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
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
                editable={true}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
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
                editable={true}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
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
                editable={false}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                editable={false}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                editable={false}
                submittable={true}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>

        <div style={{ position: "absolute", top: 100, left: 600, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                editable={true}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                editable={true}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                editable={true}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>

        <div style={{ position: "absolute", top: 100, left: 900, width: 280 }}>
            <Input
                defaultValue="1234"
                mode="bare"
                editable={false}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="underline"
                editable={false}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
            <div style={{ height: 50 }} />
            <Input
                defaultValue="1234"
                mode="border"
                editable={false}
                submittable={false}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                placeholder="placeholder"
            />
        </div>
    </div>
);

export default Debug;
