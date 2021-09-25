import React from "react";

const styles = {
    container: {
        height: "var(--VbotFooterHeight)",
        backgroundColor: "var(--PrimaryBGColor)",
        color: "var(--SecondaryFontColorDarken)",
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
