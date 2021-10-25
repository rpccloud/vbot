import React from "react";
import Footer from "./plugin/footer";
import Browser from "./browser";


const Debug = () => (
    <div className="vbot-fill-viewport" style={{display: "flex", flexFlow: "column"}} >
        <Browser/>
        <Footer/>
    </div>
)

export default Debug



