import React, { useRef } from "react";
import Input from "../../ui/component/Input";
import {
    UserOutlined,
} from '@ant-design/icons';
import { TabBar } from "../../tab/tab-bar";
import { AppPageKind } from "../../tab/defs";


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
                <div ref={this.ref} style={{height:300, background: "green"}} />
                <div style={{width: 100, height: 100, background: "red"}}  onClick={() => {this.tabBar?.addTab(AppPageKind.Moved, "", true)}}></div>
            </div>
        )
    }
  }

export default Debug



