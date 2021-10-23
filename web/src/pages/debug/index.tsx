import React from "react";
import Footer from "../common/Footer";
import Browser from "../main/browser";


const Debug = () => (
    <div className="vbot-fill-viewport" style={{display: "flex", flexFlow: "column"}} >
        <Browser/>
        <Footer/>
    </div>
)

export default Debug



