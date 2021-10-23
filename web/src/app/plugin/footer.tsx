import React from "react";

const styles = {
    container: {
        fontSize: "var(--Vbot-FontSizeSmall)",
        minHeight: "var(--Vbot-FooterHeight)",
        color: "var(--Vbot-FontColorLighten)",
    }
}

const Footer = () => {
    return (
        <div className="vbot-container-center" style={styles.container} >
            Copyright rpccloud.com ©2021 Created by tianshuo
        </div>
    )
}

export default Footer
