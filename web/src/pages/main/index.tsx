import React, { useState } from "react";
import { Layout, Menu } from 'antd';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Header from "../common/Header";
import VLayout from "../../component/VLayout";
import Footer from "../common/Footer";
import HLayout from "../../component/HLayout";
import HSpacer from "../../component/HSpacer";

const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    left: {
        outerContainer: {
            overflow: "hidden",
            backgroundColor: "var(--Vbot-BackgroundColorLighten)",
        },
        innerContainer: {
            overflow: 'hidden auto',
        }
    },
    content: {
        backgroundColor: "var(--Vbot-BackgroundColorLighten)",
    }
}

const Main = () => {
    const [openKeys, setOpenKeys] = useState(['sub1'])
    const [selectKeys, setSelectKeys] = useState(['1'])

    const siderView = (
        <Sider theme="light" width={190}>
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
        <VLayout.Container className="vbot-fill-auto">
            <VLayout.Dynamic>
                <HLayout.Container>
                    <HSpacer size={16}/>
                    <HLayout.Dynamic>
                        <div
                            className="vbot-container-round vbot-container-shadow vbot-fill-auto"
                            style={styles.content}
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
    )

    return (
        <VLayout.Container className="vbot-fill-viewport">
            <VLayout.Dynamic>
                <HLayout.Container>
                    <HLayout.Fixed>
                        <VLayout.Container>
                            <VLayout.Fixed>
                                <Header/>
                            </VLayout.Fixed>
                            <div style={styles.left.outerContainer} className="vbot-container-round-right vbot-container-shadow vbot-fill-auto" >
                                <div style={styles.left.innerContainer} className="vbot-fill-auto">
                                        {siderView}
                                </div>
                            </div>
                        </VLayout.Container>
                    </HLayout.Fixed>

                    <VLayout.Container>
                        <VLayout.Fixed>
                            <div style={{height: "var(--Vbot-HeaderHeight)"}} />
                        </VLayout.Fixed>
                        {contentView}
                    </VLayout.Container>
                </HLayout.Container>
            </VLayout.Dynamic>

            <VLayout.Fixed>
                <Footer/>
            </VLayout.Fixed>
        </VLayout.Container>
    );
}

export default Main

