import { makeAutoObservable, runInAction } from "mobx"
import { Locale } from "../locale"

export class AppData {
    locale?: Locale

    constructor() {
        makeAutoObservable(this)
        this.setLang(window.navigator.language)
    }

    async setLang(lang: string) {
       let ret = await Locale.new(lang)
        runInAction(() => {
            this.locale  = ret
        })
    }

    isValid(): boolean {
        return !!this.locale
    }
}

export const gAppData = new AppData()

