
import { makeAutoObservable } from "mobx"


class AppManager {
    public getLocalString(): RootData {
        return this.rootData
    }
}

const gAppManager = new AppManager()
export default gAppManager
