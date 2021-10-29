import React from "react";
import Button from "../ui/component/Button";
import { AiOutlineLock } from "@react-icons/all-files/ai/AiOutlineLock";

const Debug = () => (
    <div className="vbot-fill-viewport">
        <div style={{ top: 100, left: 100 }}>
            <Button
                // value="Click"
                // size="small"
                // width={200}
                value="HI"
                round={true}
                border={true}
                bold={true}
                padding="16px 10px 16px 10px"
                icon={<AiOutlineLock />}
            />
        </div>
    </div>
);

export default Debug;
