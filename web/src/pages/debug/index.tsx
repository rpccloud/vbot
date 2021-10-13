import React from "react";
import { TabConfig } from "../../tab/config";
import { TabBar } from "../../tab/tab-bar";

class Debug extends React.Component {
    private ref : any
    private tabBar?: TabBar

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.tabBar = new TabBar(TabConfig.get())
        this.ref.current.appendChild(this.tabBar.getRootElem())
    }

    render() {
        return (
            <div className="vbot-fill-viewport">
                <div ref={this.ref} style={{height:300, background: "green"}} />
                <div style={{width: 100, height: 100, background: "red"}}  onClick={() => {this.tabBar?.addTab(false, "test-0", true)}}></div>
            </div>
        )
    }
  }

export default Debug



