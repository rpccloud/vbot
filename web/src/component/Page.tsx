import React from "react";
const Page =  (props: {children: any}) => (
    <div style={{height:"100vh", width: "100vw"}}>
        {props.children}
    </div>
)
export default Page
