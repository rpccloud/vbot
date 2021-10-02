import React from "react";
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

const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    sider: {
        overflow: 'auto',
        height: "calc(100vh - var(--VbotHeaderHeight) - var(--VbotFooterHeight))",
    },
    content: {
        background: "var(--PrimaryBGColor)",
    },

}

class Main extends React.Component {
    render() {
        return (
            <VLayout.Container className="vbot-fill-viewport">
                <Header/>
                <VLayout.Dynamic>
                    <HLayout.Container>
                        <Sider  theme="light" width={190} style={styles.sider}>
                            <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                            >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu>
                            </Menu>
                        </Sider>
                        <HLayout.Dynamic>
                            <div className="vbot-fill-auto" style={styles.content}>
                                <VLayout.Container>
                                    <div style={{padding:"20px 24px 20px 24px"}}>
                                        <Breadcrumb>
                                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                                            <Breadcrumb.Item>List</Breadcrumb.Item>
                                            <Breadcrumb.Item>App</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </div>

                                    <VLayout.Dynamic>
                                        <div style={{display: "flex", background: "red", margin:"10px", height:"auto", width: "auto"}}></div>
                                    </VLayout.Dynamic>
                                </VLayout.Container>
                            </div>
                        </HLayout.Dynamic>
                    </HLayout.Container>
                </VLayout.Dynamic>
                <Footer/>
            </VLayout.Container>
        );
    }
}

export default Main

