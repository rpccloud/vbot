import React from "react";
import Button from "../ui/component/Button";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";
import Input from "../ui/component/Input";

const Debug = () => (
    <div className="vbot-fill-viewport" style={{ background: "#333" }}>
        <div style={{ position: "absolute", top: 100, left: 100, width: 400 }}>
            <Button
                value="Cancel"
                size="medium"
                style={{ borderRadius: 20 }}
                round={false}
                border={true}
                icon={<AiOutlineLock />}
            />

            <Button
                value="Cancel"
                size="large"
                style={{ borderRadius: 20 }}
                round={false}
                border={true}
                icon={<AiOutlineLock />}
            />
            <span style={{ height: 50 }} />
            <Input
                value="1234"
                label="Name:"
                initEdit={false}
                onEdit={() => {}}
            />

            <span style={{ height: 50 }} />
            <Input
                value="1234"
                initEdit={false}
                underline={true}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
                onEdit={() => {}}
            />
            <span style={{ height: 50 }} />
            <Input
                value="1234"
                label="Name:"
                type="password"
                initEdit={false}
                onEdit={() => {}}
            />
        </div>
    </div>
);

export default Debug;
