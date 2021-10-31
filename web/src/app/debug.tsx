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
                focusable={false}
                round={false}
                border={true}
                icon={<AiOutlineLock />}
            />
            <div style={{ height: 50 }} />
            <Input value="1234" label="Name:" initEdit={false} />

            <div style={{ height: 50 }} />
            <Input
                value="1234"
                initEdit={false}
                embed={true}
                underline={true}
                prefixIcon={<AiOutlineLock />}
                label="Name:"
            />
            <div style={{ height: 50 }} />
            <Input
                value="1234"
                label="Name:"
                type="password"
                initEdit={false}
            />
        </div>
    </div>
);

export default Debug;
