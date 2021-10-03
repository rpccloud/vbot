import React from "react";
import HLayout from "../../component/HLayout";

const styles = {
    container: {
        height: "var(--Vbot-HeaderHeight)",
        color: "var(--Vbot-PrimaryColor)",
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
            <HLayout.Container className="vbot-container-center">
                <div style={styles.logo}>Vbot</div>
                <HLayout.Dynamic/>
            </HLayout.Container>

        </div>
    )
}

export default Header
