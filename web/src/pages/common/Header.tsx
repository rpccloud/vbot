import React from "react";
import HLayout from "../../component/HLayout";

const styles = {
    container: {
        height: "var(--VbotHeaderHeight)",
        color: "var(--PrimaryColor)",
        backgroundColor: "var(--PrimaryBGColor)",
    },
    logo: {
        fontSize: "var(--FontSizeLarge)",
        marginLeft: 24,
        fontWeight: 900,
    },
    version: {
        fontSize: "var(--FontSizeSmall)",
        marginLeft: 10,
        marginTop: 6,
    },
}

const Header = () => {
    return (
        <div className="vbot-header" style={styles.container}>
            <HLayout.Container className="vbot-container-center">
                <div style={styles.logo}>Vbot</div>
                <HLayout.Dynamic/>
            </HLayout.Container>

        </div>
    )
}

export default Header
