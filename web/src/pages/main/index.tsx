import React, { useState } from "react";
import { Layout, Menu } from 'antd';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Header from "../common/Header";
import Footer from "../common/Footer";

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

const Main = () => {
    const [openKeys, setOpenKeys] = useState(['sub1'])
    const [selectKeys, setSelectKeys] = useState(['1'])

    const siderView = (
        <Sider width={190}>
            <Menu mode="inline" selectedKeys={selectKeys}  openKeys={openKeys}>
                <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                    <Menu.Item key="1" className="vbot-menu">option1</Menu.Item>
                    <Menu.Item key="2" className="vbot-menu">option2</Menu.Item>
                    <Menu.Item key="3" className="vbot-menu">option3</Menu.Item>
                    <Menu.Item key="4" className="vbot-menu">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                    <Menu.Item key="5" className="vbot-menu">option5</Menu.Item>
                    <Menu.Item key="6" className="vbot-menu">option6</Menu.Item>
                    <Menu.Item key="7" className="vbot-menu">option7</Menu.Item>
                    <Menu.Item key="8" className="vbot-menu">option8</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                    <Menu.Item key="9" className="vbot-menu">option9</Menu.Item>
                    <Menu.Item key="10" className="vbot-menu">option10</Menu.Item>
                    <Menu.Item key="11" className="vbot-menu">option11</Menu.Item>
                    <Menu.Item key="12" className="vbot-menu">option12</Menu.Item>
                    <Menu.Item key="13" className="vbot-menu">option9</Menu.Item>
                    <Menu.Item key="14" className="vbot-menu">option10</Menu.Item>
                    <Menu.Item key="15" className="vbot-menu">option11</Menu.Item>
                    <Menu.Item key="16" className="vbot-menu">option12</Menu.Item>
                    <Menu.Item key="17" className="vbot-menu">option9</Menu.Item>
                    <Menu.Item key="18" className="vbot-menu">option10</Menu.Item>
                    <Menu.Item key="19" className="vbot-menu">option11</Menu.Item>
                    <Menu.Item key="20" className="vbot-menu">option12</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )

    const contentView = (
        <div
            style={styles.content}
            onClick={() => {
                setOpenKeys(["sub3"])
                setSelectKeys(["9"])
            }}
        >
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
            <div>hi</div><div>hi</div><div>hi</div><div>hi</div><div>hi</div>
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
}

export default Main

