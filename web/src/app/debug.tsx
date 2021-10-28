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
                padding="6px 16px 6px 16px"
                icon={<AiOutlineLock />}
                color="rgb(30, 30, 30)"
                hoverColor="blue"
                clickColor="green"
            />
        </div>
    </div>
);

export default Debug;
