import React from "react";
import { PluginProps } from "..";
// import { RiComputerLine } from "@react-icons/all-files/ri/RiComputerLine";
import { XTerm } from "../terminal";

const ServerShow = (props: PluginProps) => {
    // useEffect(() => {
    //     getChannel("vbot-browser")?.call(
    //         "SetTitle",
    //         props.tabID,
    //         <RiComputerLine />,
    //         "23234234134345345345x"
    //     );
    // }, [props.tabID]);

    return <XTerm style={{ flex: "1 0 0" }} />;
};

export default ServerShow;
