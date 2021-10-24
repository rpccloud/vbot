import React from "react";

import { TabBar } from "./tab/tab-bar";

import { AiOutlineHome } from "@react-icons/all-files/ai/AiOutlineHome";
import { RiComputerLine } from "@react-icons/all-files/ri/RiComputerLine";
import { AiOutlineBorder } from "@react-icons/all-files/ai/AiOutlineBorder";
import { EventChannel, registerChannel } from "../../../ui/event/event";
import { getPlugin } from "../../plugin";

export function getBrowserPageByID(id: string): {icon: React.ReactElement, body: React.ReactElement} {
    const arr = id.split(":")
    const body = getPlugin({kind:arr[0], param: arr[1]})
    switch(arr[0]) {
        case "home":
            return {icon: <AiOutlineHome/>, body: body}
        case "server.show":
            return {icon: <RiComputerLine/>, body: body}
        default:
            return {icon: <AiOutlineBorder/>, body: body}
    }
}

interface BrowserState {
    list: Array<string>
    focus: string
}

class Browser extends React.Component<{}, BrowserState> {
    private tabBarRef : any
    private tabBar: TabBar
    private channel: EventChannel | null

    constructor(props: any) {
        super(props);
        this.tabBar = new TabBar((focus: string, list: Array<string>) => {
            this.setState({
                list: list,
                focus: focus,
            })
        })
        this.tabBarRef = React.createRef()
        this.state = {
            list: new Array<string>(),
            focus: "",
        }
        this.channel = null
    }

    componentDidMount() {
        this.channel = registerChannel("vbot-browser")
        this.channel?.listen("AddTab", (param: string) => {
            this.tabBar.addTab(false, param, true, "", getBrowserPageByID(param).icon)
        })
        this.tabBarRef.current.appendChild(this.tabBar.getRootElem())
        this.tabBar.addTab(true, "home", true, "Vbot", getBrowserPageByID("home").icon)
    }

    componentWillUnmount() {
        this.tabBar.destroy()
        this.channel?.close()
        this.channel = null
    }

    render() {
        return (
            <div style={{display: "flex", flex: "1 0 0", flexFlow: "column"}}>
                <div ref={this.tabBarRef}/>
                {
                    this.state.list.map(it => {
                        return (
                            <div style={{flex: "1 0 0", overflow: "auto", display: (it === this.state.focus) ? "flex" : "none"}}>
                                {getBrowserPageByID(it).body}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Browser
