import React from "react";

const styles = {
    container: {
        height: "var(--Vbot-HeaderHeight)",
        color: "var(--Vbot-PrimaryColor)",
        display: "flex",
        alignItems: "center",
    },
    logo: {
        fontSize: "var(--Vbot-FontSizeLarge)",
        marginLeft: 24,
        fontWeight: 900,
    },
}

const Header = () => {
    return (
        <div className="vbot-header" style={styles.container}>
            <div style={styles.logo}>Vbot</div>
        </div>
    )
}

export default Header
