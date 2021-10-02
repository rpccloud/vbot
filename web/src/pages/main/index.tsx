import React, { useState } from "react";
import { Breadcrumb, Layout, Menu } from 'antd';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import Footer from "../common/Footer";
import HLayout from "../../component/HLayout";
import VSpacer from "../../component/VSpacer";
import HSpacer from "../../component/HSpacer";

const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    sider: {
        overflow: 'hidden auto',
        height: "calc(100vh - var(--VbotHeaderHeight) - var(--VbotFooterHeight))",
    }
}

const Main = () => {
    const [openKeys, setOpenKeys] = useState(['sub1'])
    const [selectKeys, setSelectKeys] = useState(['1'])

    return (
        <VLayout.Container className="vbot-fill-viewport">
            <Header/>
            <VLayout.Dynamic>
                <HLayout.Container>
                    <Sider theme="light" width={190} style={styles.sider} className="vbot-container-round-right vbot-container-shadow">
                        <Menu
                        mode="inline"
                        selectedKeys={selectKeys}
                        openKeys={openKeys}
                        style={{ height: '100%', borderRight: 10 }}
                        >
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
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <HLayout.Dynamic>
                        <div className="vbot-fill-auto">
                            <VLayout.Container>
                                {/* <div style={{padding:"16px 16px 16px 24px"}}>
                                    <Breadcrumb>
                                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                                        <Breadcrumb.Item>List</Breadcrumb.Item>
                                        <Breadcrumb.Item>App</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div> */}

                                <VLayout.Dynamic>
                                    <HLayout.Container>
                                        <HSpacer size={16}/>
                                        <HLayout.Dynamic>
                                            <div
                                                className="vbot-container-round vbot-container-shadow"
                                                style={{background: "white", height:"100%", width: "100%"}}
                                                onClick={() => {
                                                    setOpenKeys(["sub3"])
                                                    setSelectKeys(["9"])
                                                }}
                                            >
                                            </div>
                                        </HLayout.Dynamic>
                                        <HSpacer size={16}/>
                                    </HLayout.Container>
                                </VLayout.Dynamic>
                            </VLayout.Container>
                        </div>
                    </HLayout.Dynamic>
                </HLayout.Container>
            </VLayout.Dynamic>
            <VSpacer size={4}/>
            <Footer/>
        </VLayout.Container>
    );
}

export default Main

