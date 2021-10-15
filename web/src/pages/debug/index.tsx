import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import React from "react";

import { TabBar } from "../../tab/tab-bar";
import { debugChannelMap, registerChannel } from "../../ui/event/event";

function testDebug() {
    debugChannelMap()

    const ch =  registerChannel("testChannel")

    debugChannelMap()

    const listener = ch?.listen("SayHello", function() {})

    debugChannelMap()

    listener?.close()

    debugChannelMap()
}

testDebug()

class Debug extends React.Component {
    private ref : any
    private tabBar?: TabBar

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.tabBar = new TabBar()
        this.ref.current.appendChild(this.tabBar.getRootElem())
    }

    render() {
        return (
            <div className="vbot-fill-viewport">
                <div ref={this.ref} style={{height:300}} />
                <div style={{width: 100, height: 100, background: "red"}}  onClick={() => {this.tabBar?.addTab(false, "test-0", true, "title-test-a12", <AiOutlineEye />)}}></div>
            </div>
        )
    }
  }

export default Debug



