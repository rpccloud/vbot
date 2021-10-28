import React from "react";
import Button from "../ui/component/Button";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

const Debug = () => (
    <div className="vbot-fill-viewport">
        <div style={{ top: 100, left: 100 }}>
            <Button
                value="Click"
                size="medium"
                width={200}
                round={false}
                border={false}
                bold={true}
                padding="6px 16px 6px 16px"
                icon={<AiOutlineLock />}
                color="rgb(30, 30, 30)"
                hoverColor="rgba(255, 0, 0, 0.5)"
                clickColor="rgba(255, 0, 0, 1)"
            />
        </div>
    </div>
);

export default Debug;
