import { makeAutoObservable, runInAction } from "mobx"
import { Locale } from "../locale"


async function changeTheme(isDark: boolean) {
    gCssManager.loadCss("./base.css", () => {
        require("./base.css")
    })

    if (isDark) {
        gCssManager.loadCss("./app.dark.css", () => {
            require("./app.dark.css")
        })
        gCssManager.loadCss("antd/dist/antd.dark.css", () => {
            require("antd/dist/antd.dark.css")
        })
        gCssManager.unloadCss("./app.css")
        gCssManager.unloadCss("antd/dist/antd.css")
    } else {
        gCssManager.loadCss("./app.css", () => {
            require("./app.css")
        })
        gCssManager.loadCss("antd/dist/antd.css", () => {
            require("antd/dist/antd.css")
        })
        gCssManager.unloadCss("./app.dark.css")
        gCssManager.unloadCss("antd/dist/antd.dark.css")
    }
}

function isElementIn(list: Array<HTMLElement>, elem: Element): boolean {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === elem) {
            return true
        }
    }

    return false
}

class CssManager {
    cssMap = new Map<string, HTMLElement>()

    loadCss(file: string, load: () => void) {
        let elem = this.cssMap.get(file)
        if (elem) {
            document.head.appendChild(elem);
        } else {
            let leftStyles = new Array<HTMLElement>()

            let elemList = document.head.getElementsByTagName("style")
            for (let i = 0; i < elemList.length; i++) {
                leftStyles.push(elemList[i])
            }
            load()
            let rightStyles = document.head.getElementsByTagName("style")

            for (let i = 0; i < rightStyles.length; i++ ) {
                let elem = rightStyles[i]
                if (!isElementIn(leftStyles, elem)) {
                    this.cssMap.set(file, elem)
                }
            }
        }
    }

    unloadCss(file: string) {
        let elem = this.cssMap.get(file)
        if (elem) {
            elem.remove()
        }
    }
}

const gCssManager = new CssManager()

export class AppData {
    locale?: Locale
    displayMode: string

    constructor() {
        makeAutoObservable(this)

        this.displayMode = ""
        this.setDisplayMode("dark")
        this.setLang(window.navigator.language)
    }

    async setLang(lang: string) {
       let ret = await Locale.new(lang)
        runInAction(() => {
            this.locale  = ret
        })
    }

    setDisplayMode(mode: string) {
        runInAction(() => {
            this.displayMode = mode
        });
        changeTheme(this.displayMode === "dark")
    }

    isValid(): boolean {
        return !!this.locale
    }
}

export const gAppData = new AppData()

