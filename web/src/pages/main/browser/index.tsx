import React from "react";

import { TabBar } from "./tab/tab-bar";

import { AiOutlineHome } from "@react-icons/all-files/ai/AiOutlineHome";
import { RiComputerLine } from "@react-icons/all-files/ri/RiComputerLine";
import { AiOutlineBorder } from "@react-icons/all-files/ai/AiOutlineBorder";
import Home from "./page/home";

export function getBrowserPageByID(id: string): {icon: React.ReactElement, body: React.ReactElement} {
    const arr = id.split(":")
    switch(arr[0]) {
        case "home":
            return {icon: <AiOutlineHome/>, body: <Home />}
        case "servers":
            return {icon: <RiComputerLine/>, body: <div></div>}
        default:
            return {icon: <AiOutlineBorder/>, body: <div></div>}
    }
}

interface BrowserState {
    list: Array<string>
    focus: string
}

class Browser extends React.Component<{}, BrowserState> {
    private tabBarRef : any
    private tabBar: TabBar

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
    }

    componentDidMount() {
        this.tabBarRef.current.appendChild(this.tabBar.getRootElem())
        this.tabBar.addTab(true, "home", true, "Vbot", getBrowserPageByID("home").icon)
    }

    componentWillUnmount() {
        this.tabBar.destroy()
    }

    render() {
        return (
            <div style={{display: "flex", flex: "1 0 0", flexFlow: "column"}}>
                <div ref={this.tabBarRef}/>

                <div style={{flex: "1 0 0", overflow: "auto", display: "flex"}}>
                    {getBrowserPageByID("home").body}
                </div>
            </div>
        )
    }
}

export default Browser
