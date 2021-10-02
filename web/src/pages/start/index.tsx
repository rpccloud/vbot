import React from "react";
import { message, Spin } from "antd";
import { AppUser } from "../../AppManager";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import VLayout from "../../component/VLayout";
import Header from "../common/Header";
import Footer from "../common/Footer";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const styles = {
    text: {
        fontSize: "var(--FontSizeLarge)",
        color: "var(--PrimaryFontColor)",
        marginLeft: 10,
    },
}

const StartPage = observer((props: any) => {
    let history = useHistory();

    setTimeout(async () => {
        try {
            let ret = await AppUser.send(3000, "#.user:IsInitialized")
            if (ret) {
                history.push("/login")
            } else {
                history.push("/register")
            }
        } catch(e) {
            message.error((e as any).getMessage())
            await delay(2000)
        }
    })

    return (
        <VLayout.Container className="vbot-fill-viewport">
            <Header/>
            <VLayout.Dynamic>
                <div className="vbot-fill-auto vbot-container-center">
                    <Spin size="default" />
                    <div style={styles.text}>Loading ...</div>
                </div>
            </VLayout.Dynamic>
            <Footer/>
        </VLayout.Container>
    )
})

export default StartPage
