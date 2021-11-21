import React from "react";
import { PluginProps } from "..";

export const ServerDelete = (props: PluginProps) => {
    return <div></div>;
};
// import { message } from "antd";
// import { observer } from "mobx-react-lite";
// import Card from "../../../ui/component/Card";
// import { AppUser } from "../../AppManager";
// import { PluginProps } from "..";

// const ServerDelete = observer((props: PluginProps) => {
//     let item = props.data.item;
//     return (
//         <Card
//             title="Remove SSH"
//             prevName="Cancel"
//             width={460}
//             onPrev={() => {
//                 if (props.data && props.data.goBack) {
//                     props.data.goBack(false);
//                 }
//             }}
//             nextName="Remove"
//             onNext={async () => {
//                 try {
//                     await AppUser.send(
//                         8000,
//                         "#.server:Delete",
//                         AppUser.getSessionID(),
//                         item.id
//                     );
//                     props.data.goBack(true);
//                 } catch (e) {
//                     message.error((e as any).getMessage());
//                     props.data.goBack(false);
//                 }
//             }}
//         >
//             <div
//                 style={{
//                     color: "var(--Vbot-FontColor)",
//                     marginTop: 20,
//                     marginBottom: 20,
//                 }}
//             >
//                 Are you sure to remove ssh item "{item.user}@{item.host}:
//                 {item.port}" ?
//             </div>
//         </Card>
//     );
// });

// export default ServerDelete;
