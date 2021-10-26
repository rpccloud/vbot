import React from "react";
import { PluginProps } from "..";
import { RiComputerLine } from "@react-icons/all-files/ri/RiComputerLine";
import { getChannel } from "../../../ui/event/event";
import { XTerm } from "../terminal";

const ServerShow = (props: PluginProps) => {
    getChannel("vbot-browser")?.call(
        "SetTitle",
        props.tabID,
        <RiComputerLine />,
        "23234234134345345345x"
    );

    return (
        <div>
            <XTerm value="hello xterm" />
        </div>
    );
};

export default ServerShow;
