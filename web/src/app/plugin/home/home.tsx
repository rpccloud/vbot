import React, { useContext } from "react";
import { PluginProps } from "..";
import { AiOutlineLaptop } from "@react-icons/all-files/ai/AiOutlineLaptop";
import { AiOutlineGroup } from "@react-icons/all-files/ai/AiOutlineGroup";
import { FlexBox } from "../../../microui/component/FlexBox";
import { Button } from "../../../microui/component/Button";
import { Divider } from "../../../microui/component/Divider";
import { ThemeContext } from "../../../microui/context/theme";

interface MenuItem {
    key: string;
    icon?: React.ReactNode;
    text?: string;
}

export const Home = (props: PluginProps) => {
    const theme = useContext(ThemeContext);
    const menuList: MenuItem[] = [
        { key: "server.list", icon: <AiOutlineLaptop />, text: "Servers" },
        { key: "group.list", icon: <AiOutlineGroup />, text: "Groups" },
    ];

    return (
        <FlexBox
            style={{
                flex: 1,
                flexFlow: "row",
                alignItems: "stretch",
                justifyContent: "start",
            }}
        >
            <FlexBox
                style={{
                    width: 160,
                    flexFlow: "column",
                    overflowY: "scroll",
                    paddingTop: 10,
                }}
            >
                {menuList.map((it) => {
                    return (
                        <Button
                            key={it.key}
                            icon={it.icon}
                            text={it.text}
                            ghost={true}
                            border={false}
                            style={{
                                height: 44,
                                fontWeight: 900,
                                padding: "0px 10px 0px 10px",
                                justifyContent: "flex-start",
                            }}
                        />
                    );
                })}
            </FlexBox>
            <Divider
                type="vertical"
                space={1}
                lineWidth={1}
                color={theme.primary?.main}
            />
            <FlexBox style={{ flex: 1 }}></FlexBox>
        </FlexBox>
    );
};

// import { Layout, Menu } from "antd";
// import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
// import { Plugin, PluginProps } from "..";
// import { makeAutoObservable, runInAction } from "mobx";
// import { observer } from "mobx-react";
// import { getChannel } from "../../../ui/event/event";
// import { AiOutlineHome } from "@react-icons/all-files/ai/AiOutlineHome";

// const { Sider } = Layout;
// const { SubMenu } = Menu;

// const styles = {
//     bar: {
//         overflow: "hidden auto",
//         borderRight: "1px solid var(--Vbot-BorderColor)",
//     },
//     content: {
//         overflow: "hidden auto",
//         flex: "1 1 0",
//     },
// };

// class Data {
//     openKeys: string[];
//     selectKeys: string[];
//     kind: string;
//     id: string;

//     constructor() {
//         makeAutoObservable(this);
//         this.openKeys = [];
//         this.selectKeys = [];
//         this.kind = "";
//         this.id = "";
//         this.openKeyPath(["server.list"]);
//     }

//     reset() {
//         runInAction(() => {
//             this.openKeys = [""];
//             this.selectKeys = ["server.list"];
//             this.kind = "";
//             this.id = "";
//         });
//     }

//     openKeyPath(keyPath: string[]) {
//         const key = keyPath[0];
//         const [kind, id] = key.split(":");

//         runInAction(() => {
//             this.openKeys = keyPath;
//             this.selectKeys = [key];
//             this.kind = kind;
//             this.id = id;
//         });
//     }

//     openKey(key: string) {
//         const [kind, id] = key.split(":");

//         runInAction(() => {
//             this.openKeys = [key];
//             this.selectKeys = [key];
//             this.kind = kind;
//             this.id = id;
//         });
//     }
// }

// const data = new Data();

// const Home = observer((props: PluginProps) => {
//     useEffect(() => {
//         getChannel("vbot-browser")?.call(
//             "SetTitle",
//             props.tabID,
//             <AiOutlineHome />,
//             "Vbot"
//         );
//     }, [props.tabID]);

//     const siderView = (
//         <Sider width={190}>
//             <Menu
//                 mode="inline"
//                 selectedKeys={data.selectKeys}
//                 openKeys={data.openKeys}
//             >
//                 <Menu.Item
//                     className="vbot-menu"
//                     key="server.list"
//                     icon={<LaptopOutlined />}
//                     onClick={(o) => data.openKeyPath(o.keyPath)}
//                 >
//                     Server
//                 </Menu.Item>

//                 <SubMenu
//                     key="group.list"
//                     title="Group"
//                     icon={<UserOutlined />}
//                     onTitleClick={(o) => data.openKey(o.key)}
//                 >
//                     <Menu.Item
//                         key="1"
//                         className="vbot-menu"
//                         onClick={(o) => data.openKeyPath(o.keyPath)}
//                     >
//                         option1
//                     </Menu.Item>
//                     <Menu.Item
//                         key="2"
//                         className="vbot-menu"
//                         onClick={(o) => data.openKeyPath(o.keyPath)}
//                     >
//                         option2
//                     </Menu.Item>
//                     <Menu.Item
//                         key="3"
//                         className="vbot-menu"
//                         onClick={(o) => data.openKeyPath(o.keyPath)}
//                     >
//                         option3
//                     </Menu.Item>
//                     <Menu.Item
//                         key="4"
//                         className="vbot-menu"
//                         onClick={(o) => data.openKeyPath(o.keyPath)}
//                     >
//                         option4
//                     </Menu.Item>
//                 </SubMenu>
//             </Menu>
//         </Sider>
//     );

//     const contentView = (
//         <div style={styles.content}>
//             <Plugin kind={data.kind} data={data.id} />
//         </div>
//     );

//     return (
//         <div style={{ display: "flex", flex: "1 0 0", flexFlow: "row" }}>
//             <div style={styles.bar}>{siderView}</div>

//             <div style={{ display: "flex", flex: "1 0 0", flexFlow: "column" }}>
//                 {contentView}
//             </div>
//         </div>
//     );
// });

// export default Home;
