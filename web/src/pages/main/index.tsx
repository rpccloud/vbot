import React  from "react";
import { Layout, Menu } from 'antd';
import {
    LaptopOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Header from "../common/Header";
import Footer from "../common/Footer";
import Plugin from "../../plugin"
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react";

const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    bar: {
        overflow: "hidden auto",
        flex: "1 1 0",
        borderTop: "1px solid var(--Vbot-DividerColor)",
        borderRight: "1px solid var(--Vbot-DividerColor)",
        borderBottom: "1px solid var(--Vbot-DividerColor)",
    },
    content: {
        overflow: "hidden auto",
        flex: "1 1 0",
        borderTop: "1px solid var(--Vbot-DividerColor)",
        borderBottom: "1px solid var(--Vbot-DividerColor)",
    }
}

class PageData {
    openKeys: string[]
    selectKeys: string[]
    kind: string
    id: string

    constructor() {
        makeAutoObservable(this)
        this.openKeys = []
        this.selectKeys = []
        this.kind = ""
        this.id = ""
        this.openKeyPath(["home"])
    }

    reset() {
        runInAction(() => {
            this.openKeys = [""]
            this.selectKeys = ["home"]
            this.kind = ""
            this.id = ""
        })
    }

    openKeyPath(keyPath: string[]) {
        const key = keyPath[0]
        const [kind, id] = key.split(":")

        runInAction(() => {
            this.openKeys = keyPath
            this.selectKeys = [key]
            this.kind = kind
            this.id = id
        })
    }

    openKey(key: string) {
        const [kind, id] = key.split(":")

        runInAction(() => {
            this.openKeys = [key]
            this.selectKeys = [key]
            this.kind = kind
            this.id = id
        })
    }
}

const pageData = new PageData()

const Main = observer(() => {
    const siderView = (
        <Sider width={190}>
            <Menu mode="inline" selectedKeys={pageData.selectKeys}  openKeys={pageData.openKeys}>
                <Menu.Item
                    className="vbot-menu"
                    key="home"
                    icon={<HomeOutlined />}
                    onClick={(o) => pageData.openKeyPath(o.keyPath)}
                >
                    Home
                </Menu.Item>
                <Menu.Item
                    className="vbot-menu"
                    key="server.list"
                    icon={<LaptopOutlined />}
                    onClick={(o) => pageData.openKeyPath(o.keyPath)}
                >
                    Server
                </Menu.Item>

                <SubMenu
                    key="group.list"
                    title="Group"
                    icon={<UserOutlined />}
                    onTitleClick={(o) => pageData.openKey(o.key)}
                >
                    <Menu.Item key="1" className="vbot-menu" onClick={(o) => pageData.openKeyPath(o.keyPath)}>option1</Menu.Item>
                    <Menu.Item key="2" className="vbot-menu" onClick={(o) => pageData.openKeyPath(o.keyPath)}>option2</Menu.Item>
                    <Menu.Item key="3" className="vbot-menu" onClick={(o) => pageData.openKeyPath(o.keyPath)}>option3</Menu.Item>
                    <Menu.Item key="4" className="vbot-menu" onClick={(o) => pageData.openKeyPath(o.keyPath)}>option4</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )

    const contentView = (
        <div style={styles.content} >
            <Plugin kind={pageData.kind} param={pageData.id}/>
        </div>
    )

    return (
        <div className="vbot-fill-viewport" style={{display: "flex", flexFlow: "column"}} >
            <div style={{display: "flex", flex:"1 0 0", flexFlow: "row"}}>
                <div style={{display: "flex", flexFlow: "column"}}>
                    <Header/>
                    <div style={styles.bar}>
                        {siderView}
                    </div>
                </div>

                <div style={{display: "flex", flex:"1 0 0", flexFlow: "column"}}>
                    <div style={{height: "var(--Vbot-HeaderHeight)"}}></div>
                    {contentView}
                </div>
            </div>
            <Footer/>
        </div>
    );
})

export default Main

