import React from "react";
import { Layout, Menu } from 'antd';
import {
    LaptopOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Plugin from "../../../../plugin"
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react";

const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    bar: {
        overflow: "hidden auto",
        // flex: "1 1 0",
        //borderLeft: "1px solid var(--Vbot-PrimaryColor)",
        borderRight: "1px solid var(--Vbot-BorderColor)",
       // borderBottom: "1px solid var(--Vbot-PrimaryColor)",
    },
    content: {
        overflow: "hidden auto",
        flex: "1 1 0",
       // borderTop: "1px solid var(--Vbot-BorderColor)",
        // borderBottom: "1px solid var(--Vbot-PrimaryColor)",
    }
}

class Data {
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

const data = new Data()

const Home = observer(() => {
    const siderView = (
        <Sider width={190}>
            <Menu mode="inline" selectedKeys={data.selectKeys}  openKeys={data.openKeys}>
                <Menu.Item
                    className="vbot-menu"
                    key="server.list"
                    icon={<LaptopOutlined />}
                    onClick={(o) => data.openKeyPath(o.keyPath)}
                >
                    Server
                </Menu.Item>

                <SubMenu
                    key="group.list"
                    title="Group"
                    icon={<UserOutlined />}
                    onTitleClick={(o) => data.openKey(o.key)}
                >
                    <Menu.Item key="1" className="vbot-menu" onClick={(o) => data.openKeyPath(o.keyPath)}>option1</Menu.Item>
                    <Menu.Item key="2" className="vbot-menu" onClick={(o) => data.openKeyPath(o.keyPath)}>option2</Menu.Item>
                    <Menu.Item key="3" className="vbot-menu" onClick={(o) => data.openKeyPath(o.keyPath)}>option3</Menu.Item>
                    <Menu.Item key="4" className="vbot-menu" onClick={(o) => data.openKeyPath(o.keyPath)}>option4</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )

    const contentView = (
        <div style={styles.content} >
            <Plugin kind={data.kind} param={data.id}/>
        </div>
    )

    return (
        <div style={{display: "flex", flex:"1 0 0", flexFlow: "row"}}>
            <div style={styles.bar}>
                {siderView}
            </div>

            <div style={{display: "flex", flex:"1 0 0", flexFlow: "column"}}>
                {contentView}
            </div>
        </div>
    );
})

export default Home

