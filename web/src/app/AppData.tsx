import { Locale, newLocale } from "../locale"

export class AppData {
    locale: Locale

    constructor(locale: Locale) {
        this.locale = locale
    }
}

export async function initData() {
    let locale = await newLocale("en_US")
    gAppData = new AppData(locale)
}

export let gAppData: AppData | undefined

